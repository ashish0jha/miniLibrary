import express from 'express';
import { userAuth } from '../middleware/auth.js';
import { leaderboardHandler } from '../controller/library.js';

const router = express.Router();

router.get("/leaderboard",userAuth,leaderboardHandler);

export default router;