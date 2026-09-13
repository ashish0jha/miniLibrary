import express from 'express';
import { addBooks, reduceBooks, RegisterBooksHandler, removeBookHandler } from '../controller/admin.js';
import { requireRole, userAuth } from '../middleware/auth.js';

const adminrouter = express.Router();

adminrouter.post("/registerBooks",userAuth, requireRole('admin'), RegisterBooksHandler);
adminrouter.post("/removeBooks",userAuth, requireRole('admin'), removeBookHandler);
adminrouter.patch("/addBooks",userAuth, requireRole('admin'), addBooks);
adminrouter.patch("/reduceBooks",userAuth, requireRole('admin'), reduceBooks);

export default adminrouter;