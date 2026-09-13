declare global {
    namespace Express {
        interface Request {
            user?: {
                id:Number;
                username:string;
                email:string;
                created_at:Date;
            }
        }
    }
}

export {};