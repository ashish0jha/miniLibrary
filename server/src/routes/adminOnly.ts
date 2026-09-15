import express from 'express';
import { requireRole, userAuth } from '../middleware/auth.js';
import { overdueHandler } from '../controller/adminOnly.js';

const router = express.Router();

router.get('/overdue',userAuth,requireRole('admin'),overdueHandler);

export default router;