import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import pgClinet from "../config/db.js";

export async function userAuth(req:Request,res:Response,next:NextFunction) {
    try{
        const {token} = req.cookies;
        
        if(!token) {
            throw new Error("Login First");
        }
        const privateKey = process.env.PRIVATE_KEY;
        if(!privateKey){
            throw new Error("private Key Does not Exist in .env") 
        }

        const decoded = jwt.verify(token,privateKey);
        if(typeof decoded === "string" || !decoded.username) {
            throw new Error("Login First");
        }
        const username = decoded.username;
       
        const result = await pgClinet.query(`SELECT id,username,email,created_at FROM users WHERE username = $1`,[username]);
        if(result.rows.length === 0) {
            throw new Error("User is Not Registered Yet");
        }
        const user = result.rows[0];
        req.user = user;

        next();
    }
    catch(err) {
        res.status(400).json({error:(err as Error).message})
    }
}