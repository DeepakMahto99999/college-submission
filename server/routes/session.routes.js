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

router.get("/current",  getCurrentSession);

router.post("/start",  startSession);

router.post("/complete",  completeSession);

router.post("/invalid",  invalidSession); 

router.post("/cancel/:sessionId", cancelSession);

export default router;