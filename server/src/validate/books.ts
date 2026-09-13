import type { Request } from "express";


export function validateBooksRegistration(req:Request) {
    const {title,author,total_copies,available_copies} = req.body;

    if(title.length > 100 || author.length > 100) {
        throw new Error("Books/Author name is too long");
    }
    if(!title || !author || !total_copies || !available_copies) {
        throw new Error('Every Field is Required');
    }
    if(available_copies > total_copies) {
        throw new Error("Available Copies must be less than Total Copies");
    }
}