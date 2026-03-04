import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/leaderboard", authUser, getLeaderboard);

export default router;
