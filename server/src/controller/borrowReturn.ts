import type { Request, Response } from "express";
import { validateBooksTitleAndAuthor } from "../validate/books.js";
import pgClinet from "../config/db.js";

export async function borrowHandler(req:Request,res:Response) {
    // single dedicated client from the pool for this whole transaction
    const client = await pgClinet.connect();
    try{
        validateBooksTitleAndAuthor(req);

        const {title,author} = req.body;
        const user_id = req.user?.id;

        await client.query('BEGIN');          //transaction begins
        
        // FOR UPDATE — locks this row until COMMIT/ROLLBACK,
        // so a second concurrent request has to WAIT here instead of reading stale data
        const query = `SELECT * FROM books WHERE title = $1 AND author = $2 FOR UPDATE`;
        const result = await client.query(query, [title, author]);
    
        if(result.rows.length === 0) {
            throw new Error("This lot doesn't Exist ");
        }
       
        let { id, available_copies,title:bookName } = result.rows[0];

        if(available_copies <= 0) {
            throw new Error("This Book is Currently Unavailable");
        }

        const currentBorrowedQuery = `SELECT COUNT(*) FROM borrow_records WHERE user_id = $1 AND returned_date IS NULL`;

        const currentBorrowed = await client.query(currentBorrowedQuery,[user_id]);

        const count = parseInt(currentBorrowed.rows[0].count);

        if(count >= 3) {
            throw new Error("You have reached Your Limits i.e. 3");
        }

        const alreadyTakenQuery = `SELECT * FROM borrow_records WHERE user_id = $1 AND book_id = $2 AND returned_date IS NULL`;

        const alreadyTaken = await client.query(alreadyTakenQuery,[user_id,id]);

        if(alreadyTaken.rows.length > 0) {
            throw new Error("User has Teken this Book Already");
        }

        available_copies = available_copies - 1;

        const decreaseQuery = `UPDATE books SET available_copies = $1 WHERE id = $2`;
        const borrow_query = `INSERT INTO borrow_records(user_id,book_id,due_date) VALUES($1,$2,$3)`;
        const dueDate = new Date(Date.now() + 15*24*60*60*1000);
        
        await client.query(decreaseQuery,[available_copies,id]);
        await client.query(borrow_query,[user_id,id,dueDate]);

        await client.query('COMMIT');
        
        const toReturn = {
            bookName,
            available_copies,
        }
        res.json({msg:"Borrowed SuccessFully",data:toReturn});
    }  
    catch(err) {
        await client.query('ROLLBACK');
        res.status(400).json({error:(err as Error).message});
    }
    finally {
        client.release();
    }
}