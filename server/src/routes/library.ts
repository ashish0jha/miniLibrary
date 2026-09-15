import express from 'express';
import { userAuth } from '../middleware/auth.js';
import { leaderboardHandler, searchHandler, totalBorrowesBystudentHandler } from '../controller/library.js';

const router = express.Router();

router.get("/leaderboard",userAuth,leaderboardHandler);
router.get("/borrowed",userAuth,totalBorrowesBystudentHandler);
router.get('/search/:key/:searchContent',userAuth,searchHandler);

export default router;