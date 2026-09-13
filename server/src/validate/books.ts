import type { Request } from "express";

export function validateBooksRegistration(req:Request) {
    const {title,author,total_copies,available_copies} = req.body;

    if(title.length > 100 || author.length > 100) {
        throw new Error("Books/Author name is too long");
    }
    if(total_copies === 0 || available_copies === 0) {
        throw new Error("Initially, Can't Zero")
    }
    if(!title || !author || !total_copies || !available_copies) {
        throw new Error('Every Field is Required');
    }
    if(available_copies !== total_copies) {
        throw new Error("Available Copies must be equal to Total Copies,Initially");
    }
}

export function validateBooksTitleAndAuthor(req:Request) {
    if(!req.body) {
        throw new Error("Fill Entries")
    }

    const {title,author} = req.body;

    if(!title || !author) {
        throw new Error("Enter both title and author");
    }
    if(title.length > 100 || author.length > 100) {
        throw new Error("title/author is too long");
    }
}