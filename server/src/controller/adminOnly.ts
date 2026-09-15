import type { Request, Response } from "express";
import pgClinet from "../config/db.js";

export async function overdueHandler(req:Request,res:Response) {
    try{
        const query = `SELECT b.title,b.author,bb.due_date FROM borrow_records bb JOIN books b ON bb.book_id = b.id WHERE returned_date IS NULL AND due_date < NOW()`;

        const result = await pgClinet.query(query);
        if(result.rows.length === 0) {
            throw new Error("No OverDue Book");
        }

        res.json({msg:"Overdue Fetched",data:result.rows});
    }
    catch(err) {
        res.status(400).json({error:(err as Error).message})
    }
}

export async function summaryHandler(req:Request,res:Response) {
    try{
        const query = `SELECT 
        ROW_NUMBER() OVER(ORDER BY b.id DESC) AS serial_no,
        b.id AS book_id,
        b.title AS book_title,
        COUNT(br.book_id) AS no_of_borrowed_book,
        ARRAY_AGG(u.username) AS borrow_by 
        FROM borrow_records br JOIN books b ON br.book_id = b.id 
        JOIN users u ON u.id = br.user_id 
        WHERE br.returned_date IS NULL
        GROUP BY b.id , b.title
        ORDER BY no_of_borrowed_book DESC`;

        const result = await pgClinet.query(query);
        if(result.rows.length === 0) {
            throw new Error("No Books for the Summary");
        }
        res.json({msg:"Summary fetched Successful",data:result.rows});
    }
    catch(err) {
        res.status(400).json({error:(err as Error).message})
    }
}