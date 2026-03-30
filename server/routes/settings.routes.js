import express from "express";
import authUser from "../middlewares/auth.middleware.js";

import {
  getSettings,
  updateSettings
} from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/", authUser, getSettings);

router.post("/", authUser, updateSettings);

export default router;