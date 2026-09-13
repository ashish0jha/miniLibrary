import { type Request, type Response } from "express";
import pgClinet from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { validateLoginData, validateSignUpData } from "../validate/auth.js";

export async function signUpHandler(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    validateSignUpData(req);

    const userCheckQuery = `SELECT * FROM users WHERE email=$1 OR username=$2`;
    const user = await pgClinet.query(userCheckQuery, [email,username]);

    if (user.rows.length > 0) {
      throw new Error("User Already Exist with this Credentials");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const insertQuery = `INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id,username`;

    const result = await pgClinet.query(insertQuery, [
      username,
      email,
      hashPassword,
    ]);

    res.status(201).json({ msg: "SuccessFull signedUp", data: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    validateLoginData(req);
    let user;
    if(username){
      const query = `SELECT * FROM users WHERE username = $1`;
      user = await pgClinet.query(query,[username]);
    }
    else {
      const query = `SELECT * FROM users WHERE email = $1`;
      user = await pgClinet.query(query,[email]);
    }
    
    if(user.rows.length === 0) {
      throw new Error("User does not exist");
    }

    const isValidPassword = await bcrypt.compare(password,user.rows[0].password);
    if(!isValidPassword) {
      throw new Error("Credentials are wrong");
    }
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey){
      throw new Error("Private Key does not exist in .env");
    }
    const token = jwt.sign({username:user.rows[0].username},privateKey,{ expiresIn: '7d' })
    res.cookie("token",token,{
      httpOnly:true,
      secure:true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    const { password: hashedPassword, ...safeUser } = user.rows[0];

    res.status(200).json({msg:"Logged In Successful",data:safeUser});

  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
