import {type ApiSuccess, type Book } from "../types";
import apiClient from "./client";

export async function registerBooks(title:string,author:string,total_copies:number,available_copies:number) {
    const res = await apiClient.post<ApiSuccess<Book>>('/admin/registerBooks',{
        title,author,total_copies,available_copies
    })
    return res.data;
}

export async function removeBooks(title:string,author:string) {
    const res = await apiClient.post<ApiSuccess<Book>>('/admin/removeBooks',{title,author});
    return res.data;
}

export async function addBooks(newQty:number,title:string,author:string) {
    const res = await apiClient.patch<ApiSuccess<Book>>('/admin/addBooks',{newQty,title,author});
    return res.data;
}

export async function reduceBooks(newQty:number,title:string,author:string) {
    const res = await apiClient.patch<ApiSuccess<Book>>('/admin/reduceBooks',{newQty,title,author});
    return res.data;
}