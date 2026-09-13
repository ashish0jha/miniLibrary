import express from "express";
import { userAuth } from "../middleware/auth.js";
import { borrowHandler } from "../controller/borrowReturn.js";

const router = express.Router();

router.get('/borrow',userAuth,borrowHandler);

export default router;