import express from 'express'
import { loginHandler, signUpHandler } from '../controller/auth.js';

const authRouter = express.Router();

authRouter.post("/signup", signUpHandler);
authRouter.post("/login",loginHandler);

export default authRouter;
