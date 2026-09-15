import type { ApiSuccess } from "../types";
import apiClient from "./client";

export async function overdue() {
    const res = await apiClient.get<ApiSuccess<{title:string,author:string,due_date:string}[]>>('/overdue');

    return res.data;
}

export async function summary() {
    const res = await apiClient.get<ApiSuccess<{serial_no:number,book_id:number,book_title:string,no_of_borrowed_book:number,borrow_by:string[]}[]>>('/summary');

    return res.data;
}