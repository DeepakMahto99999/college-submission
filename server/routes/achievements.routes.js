import express from "express";
import authUser from "../middlewares/auth.middleware.js";

import {
  getAllAchievements,
  getAchievementPreview
} from "../controllers/achievements.controller.js";

const router = express.Router();

// Global achievement list
router.get("/all", authUser, getAllAchievements);

// Dashboard preview
router.get("/preview", authUser, getAchievementPreview);

export default router;
