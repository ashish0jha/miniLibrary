import type { ApiSuccess } from "../types"
import apiClient from "./client"

export async function borrowBook(title:string,author:string) {
    const res = await apiClient.post<ApiSuccess<{bookName:string,available_copies:number}>>('/borrow',{title,author});
    return res.data;
}

export async function returnBook(title:string,author:string) {
    const res = await apiClient.patch<ApiSuccess<{bookName:string,available_copies:number}>>('/return',{title,author});
    return res.data;
}