import type { Request, Response } from "express";
import pgClinet from "../config/db.js";

export async function leaderboardHandler(req: Request, res: Response) {
  try {
    const query = `SELECT b.id, b.title,b.author,COUNT(bb.book_id) AS borrow_count FROM borrow_records bb RIGHT JOIN books b ON bb.book_id = b.id GROUP BY b.id, b.title,b.author ORDER BY borrow_count DESC`;

    const result = await pgClinet.query(query);

    res.json({msg:"LeaderBoard",data:result.rows});
  } catch (err) {
    res.status(500).json({error:(err as Error).message});
  }
}
