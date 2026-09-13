import express from "express";
import { userAuth } from "../middleware/auth.js";
import { borrowHandler, returnBookHandler } from "../controller/borrowReturn.js";

const router = express.Router();

router.get('/borrow',userAuth,borrowHandler);
router.get('/return',userAuth,returnBookHandler);

export default router;