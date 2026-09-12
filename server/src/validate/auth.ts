import type { Request } from 'express';
import validator from 'validator';

export function validateSignUpData(req:Request) {
    const {username,email,password} = req.body;

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