import express from "express";
import authUser from "../middlewares/auth.middleware.js";

import {
  getCurrentSession,
  startSession,
  completeSession,
  invalidSession,
  cancelSession
} from "../controllers/session.controller.js";

const router = express.Router();

router.get("/current", authUser, getCurrentSession);

router.post("/start", authUser, startSession);

router.post("/complete", authUser, completeSession);

router.post("/invalid", authUser, invalidSession);

router.post("/cancel/:sessionId", authUser, cancelSession);

export default router;