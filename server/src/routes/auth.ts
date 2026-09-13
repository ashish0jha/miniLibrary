import express from 'express'
import { getmeHandler, loginHandler, logoutHandler, signUpHandler } from '../controller/auth.js';
import { userAuth } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post("/signup", signUpHandler);
authRouter.post("/login",loginHandler);
authRouter.get("/getme",userAuth,getmeHandler)
authRouter.get("/logout",logoutHandler)

export default authRouter;
