import Session from "../models/Session.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";


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

  const userId = "69aaba7b4a4ae44fa95808cc";
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

  const userId = "69aaba7b4a4ae44fa95808cc";
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

  session.status = "COMPLETED";
  session.completed = true;

  await session.save();

  const user = await User.findById(userId);

  user.totalSessions += 1;
  user.totalFocusMinutes += 25;
  user.points += 50;

  await user.save();

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

  const userId = "69aaba7b4a4ae44fa95808cc"; 
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