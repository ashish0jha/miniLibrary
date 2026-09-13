import express, { type Request, type Response } from "express";
import pgClinet from "../config/db.js";
import bcrypt from 'bcrypt'
import { validateSignUpData } from "../validate/auth.js";

export async function signUpHandler (req:Request, res:Response) {
  try {
    const {username,email,password} = req.body;

    validateSignUpData(req);

    const userCheckQuery = `SELECT * FROM users WHERE email=$1`;
    const user = await pgClinet.query(userCheckQuery,[email]);

    if(user.rows.length > 0) {
        throw new Error ("User Already Exist with this Credentials");
    }
    const hashPassword = await bcrypt.hash(password,10);

    const insertQuery = `INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id,username`;

    const result = await pgClinet.query(insertQuery,[username,email,hashPassword]);

    res.status(201).json({msg:"SuccessFull signedUp",data:result.rows[0]});

  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}