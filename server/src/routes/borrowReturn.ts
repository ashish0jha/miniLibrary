import express from "express";
import { userAuth } from "../middleware/auth.js";
import { borrowHandler, returnBookHandler } from "../controller/borrowReturn.js";

const router = express.Router();

router.post('/borrow',userAuth,borrowHandler);
router.patch('/return',userAuth,returnBookHandler);

export default router;