import type { ApiSuccess, Book } from "../types";
import apiClient from "./client";

export async function leaderboard() {
    const res = await apiClient.get<ApiSuccess<{rank:number,book_id:number,book_title:string,book_author:string,borrow_count:number}[]>>('/leaderboard');
    return res.data;
}

export async function borrowed() {
    const res = await apiClient.get<ApiSuccess<{book_title:string,book_author:string,borrow_date:string}[]>>('/borrowed');
    return res.data;
}

export async function search(key:'title' | 'author' , searchContent:string) {
    const res = await apiClient.get<ApiSuccess<Book[]>>(`/search/${key}/${searchContent}`);

    return res.data;
}