import Session from "../models/Session.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";
import { checkAndUnlockAchievements } from "./achievements.controller.js";


/* =====================================================
   GET CURRENT SESSION
===================================================== */

export const getCurrentSession = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const session = await Session.findOne({
    userId,
    status: { $in: ["ARMED", "RUNNING"] }
  }).sort({ createdAt: -1 });

  res.json({
    session: session
      ? {
        id: session._id,
        topic: session.topic,
        status: session.status,
        startTime: session.startTime
      }
      : null
  });

});


/* =====================================================
   START SESSION
===================================================== */

export const startSession = asyncHandler(async (req, res) => {

  const userId = req.user.userId;
  const { topicName } = req.body;

  if (!topicName) {
    throw new AppError("Topic required", 400);
  }

  const existing = await Session.findOne({
    userId,
    status: { $in: ["ARMED", "RUNNING"] }
  });

  if (existing) {
    existing.status = "INVALID";
    await existing.save();
  }

  const session = await Session.create({
    userId,
    topic: topicName.trim().toLowerCase(),
    focusLength: 25,
    status: "RUNNING",
    startTime: new Date()
  });

  res.json({
    success: true,
    sessionId: session._id
  });

});


/* =====================================================
   COMPLETE SESSION
===================================================== */

export const completeSession = asyncHandler(async (req, res) => {

  const userId = req.user.userId;
  const { sessionId } = req.body;

  const session = await Session.findOne({
    _id: sessionId,
    userId
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.completed) {
    return res.json({ success: true });
  }

  // ================= COMPLETE SESSION =================
  // ================= COMPLETE SESSION =================
  session.status = "COMPLETED";
  session.completed = true;

  // ✅ HARD FIX (NO TRUST ON DATA)
  const focusMinutes = Number(session.focusLength) || 25;

  session.totalFocusSeconds = focusMinutes * 60;

  // 🔥 DEBUG (IMPORTANT)
  console.log("FOCUS LENGTH:", focusMinutes);
  console.log("TOTAL SECONDS SET:", session.totalFocusSeconds);

  await session.save();

  // ================= USER UPDATE =================
  const user = await User.findById(userId);

  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  let lastDate = user.lastSessionDate
    ? new Date(user.lastSessionDate)
    : null;

  if (lastDate) {
    const lastDateStart = new Date(lastDate);
    lastDateStart.setHours(0, 0, 0, 0);

    const diff = Math.floor(
      (todayStart.getTime() - lastDateStart.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (diff === 0) {
      // ✅ same day → do nothing (keep streak)
    }
    else if (diff === 1) {
      user.currentStreak += 1;
    }
    else {
      user.currentStreak = 1;
    }

  } else {
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(
    user.longestStreak,
    user.currentStreak
  );

  user.lastSessionDate = new Date();

  // ================= STATS =================
  user.totalSessions += 1;
  user.totalFocusMinutes += session.focusLength;
  user.points += 50;

  await user.save(); 

  await checkAndUnlockAchievements(userId, session);
  console.log("ACHIEVEMENT FUNCTION TRIGGERED");

  res.json({ success: true });

});


/* =====================================================
   INVALID SESSION
===================================================== */

export const invalidSession = asyncHandler(async (req, res) => {

  const userId = req.user.userId;
  const { sessionId } = req.body;

  const session = await Session.findOne({
    _id: sessionId,
    userId
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  session.status = "INVALID";
  session.invalidReason = "TOPIC_MISMATCH";

  await session.save();

  res.json({ success: true });

});


/* =====================================================
   CANCEL SESSION
===================================================== */

export const cancelSession = asyncHandler(async (req, res) => {

  const userId = req.user.userId;
  const { sessionId } = req.params;

  const session = await Session.findOne({
    _id: sessionId,
    userId
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.status === "COMPLETED" || session.status === "INVALID") {
    return res.json({
      success: true,
      message: "Session already finished"
    });
  }

  session.status = "CANCELLED";
  session.completed = false;

  await session.save();

  res.json({
    success: true,
    message: "Session cancelled"
  });

});