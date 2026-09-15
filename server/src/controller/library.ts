import type { Request, Response } from "express";
import pgClinet from "../config/db.js";

export async function leaderboardHandler(req: Request, res: Response) {
  try {
    const query = `SELECT DENSE_RANK() OVER(ORDER BY COUNT(bb.book_id) DESC) AS rank, b.id, b.title,b.author,COUNT(bb.book_id) AS borrow_count FROM borrow_records bb RIGHT JOIN books b ON bb.book_id = b.id GROUP BY b.id, b.title,b.author ORDER BY borrow_count DESC`;

    const result = await pgClinet.query(query);

    res.json({msg:"LeaderBoard",data:result.rows});
  } catch (err) {
    res.status(500).json({error:(err as Error).message});
  }
}

export async function totalBorrowesBystudentHandler(req:Request,res:Response) {
    try{
        const query = `SELECT b.title,b.author,bb.borrowed_at FROM borrow_records bb JOIN books b ON bb.book_id = b.id WHERE bb.user_id = $1 AND returned_date IS NULL`;

        const result = await pgClinet.query(query,[req.user?.id]);
        if(result.rows.length === 0) {
            throw new Error("No Books Borrowed Yet");
        }

        res.json({msg:"fetch Successful",data:result.rows});
    }
    catch(err) {
        res.status(500).json({error:(err as Error).message});
    }
}

export async function searchHandler(req:Request,res:Response) {
    try{
        const {key,searchContent} = req.params;

        if(!key || typeof key != "string") {
            throw new Error("key is not defined");
        }

        if(!["title","author"].includes(key)){
            throw new Error("Only 'title' and 'author' are allowed as key ");
        }

        const query = `SELECT * FROM books WHERE ${key} LIKE $1`;
        const result = await pgClinet.query(query,[`%${searchContent}%`]);

        if(result.rows.length === 0) {
            throw new Error(`${searchContent} is not in the Library Yet`);
        }

        res.json({msg:"search SuccessFul",data:result.rows});
    }
    catch(err) {
        res.status(400).json({error:(err as Error).message})
    }
}