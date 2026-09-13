import express from 'express';
import { addBooksHandler } from '../controller/admin.js';
import { requireRole, userAuth } from '../middleware/auth.js';

const adminrouter = express.Router();

adminrouter.post("/addBooks",userAuth, requireRole('admin'), addBooksHandler);

export default adminrouter;