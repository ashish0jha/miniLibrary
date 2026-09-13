import express from 'express'
import { signUpHandler } from '../controller/auth.js';

const authRouter = express.Router();

authRouter.post("/signup", signUpHandler);

export default authRouter;
