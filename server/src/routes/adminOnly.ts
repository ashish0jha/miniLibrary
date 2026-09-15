import express from 'express';
import { requireRole, userAuth } from '../middleware/auth.js';
import { overdueHandler, summaryHandler } from '../controller/adminOnly.js';

const router = express.Router();

router.get('/overdue',userAuth,requireRole('admin'),overdueHandler);
router.get('/summary',userAuth,requireRole('admin'),summaryHandler);

export default router;