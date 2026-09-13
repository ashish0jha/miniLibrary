import type { Request, Response } from "express";
import { validateBooksRegistration } from "../validate/books.js";
import pgClinet from "../config/db.js";

export async function addBooksHandler(req: Request, res: Response) {
  try {
    validateBooksRegistration(req);

    const { title, author, total_copies, available_copies } = req.body;

    const query = `SELECT * FROM books WHERE title = $1 AND author = $2`;
    const result = await pgClinet.query(query, [title, author]);

    if (result.rows.length > 0) {
      throw new Error("This lot is Already Registered");
    }

    const insertQuery = `INSERT INTO books(title,author,total_copies,available_copies) VALUES($1,$2,$3,$4) RETURNING id,title,author`;
    const insertResult = await pgClinet.query(insertQuery, [
      title,
      author,
      total_copies,
      available_copies,
    ]);

    res.json({ msg: "Registered Successfully", data: insertResult.rows[0] });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}