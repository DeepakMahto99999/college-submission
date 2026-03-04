import express from "express";
import authUser from "../middlewares/auth.middleware.js";

import {
  getTodayStats,
  getRecentSessions,
  getWeeklyStats,
  getDailyPattern,
  getMonthlyStats
} from "../controllers/statistics.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { recentSessionsSchema } from "../validators/statistics.validator.js";

const router = express.Router();

router.get("/today", authUser, getTodayStats);

router.get("/recent", authUser, validate(recentSessionsSchema), getRecentSessions);

router.get("/weekly", authUser, getWeeklyStats);

router.get("/daily-pattern", authUser, getDailyPattern);

router.get("/monthly", authUser, getMonthlyStats);

export default router;
