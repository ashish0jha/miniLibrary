export interface ApiSuccess <T> {
    msg:string;
    data:T
}

export interface ApiError {
    error:string;
}