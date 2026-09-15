import type { Request } from 'express';
import validator from 'validator';

export function validateSignUpData(req:Request) {
    const {username,email,password} = req.body;

    if(!username || !email || !password) {
        throw new Error("Username, email and password are required");
    }
    if(username.length > 25 || email.length > 256 || password.length > 25) {
        throw new Error("Credential(s) is/are too long");
    }
    if(validator.isEmail(email) === false) {
        throw new Error("Email is Wrong")
    }
    if(validator.isStrongPassword(password) === false) {
        throw new Error("Password is too weak");
    }
}

export function validateLoginData(req:Request) {
    const {username,email,password} = req.body;

    if(!password || typeof password !== "string") {
        throw new Error("Password is required");
    }
    if(!username && !email) {
        throw new Error("Email or username is required");
    }
    if(username && typeof username !== "string") {
        throw new Error("Invalid username");
    }
    if(email && typeof email !== "string") {
        throw new Error("Invalid email");
    }
    if((username && username.length > 25) || (email && email.length > 256) || password.length > 25) {
        throw new Error("Credential(s) is/are too long");
    }
    if(validator.isStrongPassword(password) === false) {
        throw new Error("Password is too weak");
    }
}