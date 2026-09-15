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