import {type User, type ApiSuccess } from "../types";
import apiClient from "./client";

export async function signup(username:string,email:string,password:string) {
    const res = await apiClient.post<ApiSuccess<{id:number;username:string}>>('/signup',{
        username,email,password
    })
    return res.data;
}

export async function login(username:string,email:string,password:string) {
    const res = await apiClient.post<ApiSuccess<User>>('/login',{
        username,email,password
    })
    return res.data;
}

export async function getme() {
    const res = await apiClient.get<ApiSuccess<User>>('/getme');

    return res.data;
}

export async function logout() {
    const res = await apiClient.get<ApiSuccess<null>>('/logout');
    return res.data;
}