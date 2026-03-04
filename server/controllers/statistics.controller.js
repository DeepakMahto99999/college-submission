import mongoose from "mongoose";
import Session from "../models/Session.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";


// ============================================================
// TODAY STATS (Aggregation Based)
// ============================================================

export const getTodayStats = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const result = await Session.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        completed: true,
        startTime: { $gte: start }
      }
    },
    {
      $group: {
        _id: null,
        totalSeconds: { $sum: "$totalFocusSeconds" },
        sessions: { $sum: 1 }
      }
    }
  ]);

  const totalSeconds = result[0]?.totalSeconds || 0;
  const sessionsCount = result[0]?.sessions || 0;

  res.json({
    success: true,
    sessions: sessionsCount,
    focusMinutes: Math.round(totalSeconds / 60)
  });
});



// ============================================================
// RECENT SESSIONS (Timeline - Same Logic)
// ============================================================

export const getRecentSessions = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const rawLimit = Number(req.query.limit) || 5;

  if (isNaN(rawLimit) || rawLimit <= 0) {
    throw new AppError("Invalid limit parameter", 400);
  }

  const limit = Math.min(rawLimit, 50);

  const sessions = await Session.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const mapped = sessions.map(s => ({
    topic: s.topic,
    focusLength: s.focusLength,
    startedAt: s.startTime,
    status: s.status,
    statusLabel:
      s.status === "COMPLETED" ? "Completed" :
      s.status === "INVALID" ? "Stopped" :
      s.status === "RUNNING" ? "Running" :
      "Not Started"
  }));

  res.json({
    success: true,
    sessions: mapped
  });
});



// ============================================================
// WEEKLY STATS (Aggregation Grouped by Weekday)
// ============================================================

export const getWeeklyStats = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const result = await Session.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        completed: true,
        startTime: { $gte: start }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$startTime" },
        totalMinutes: { $sum: { $divide: ["$totalFocusSeconds", 60] } }
      }
    }
  ]);

  const daily = {
    Mon: 0, Tue: 0, Wed: 0,
    Thu: 0, Fri: 0, Sat: 0, Sun: 0
  };

  const dayMap = {
    1: "Sun",
    2: "Mon",
    3: "Tue",
    4: "Wed",
    5: "Thu",
    6: "Fri",
    7: "Sat"
  };

  result.forEach(r => {
    const dayKey = dayMap[r._id];
    if (dayKey) {
      daily[dayKey] = r.totalMinutes;
    }
  });

  res.json({
    success: true,
    daily
  });
});



// ============================================================
// DAILY PATTERN (Grouped by 2-hour Buckets)
// ============================================================

export const getDailyPattern = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const result = await Session.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        completed: true,
        startTime: { $ne: null }
      }
    },
    {
      $project: {
        bucket: {
          $concat: [
            {
              $toString: {
                $multiply: [
                  { $floor: { $divide: [{ $hour: "$startTime" }, 2] } },
                  2
                ]
              }
            },
            ":00"
          ]
        },
        minutes: { $divide: ["$totalFocusSeconds", 60] }
      }
    },
    {
      $group: {
        _id: "$bucket",
        totalMinutes: { $sum: "$minutes" }
      }
    }
  ]);

  const buckets = {};

  result.forEach(r => {
    buckets[r._id] = r.totalMinutes;
  });

  res.json({
    success: true,
    pattern: buckets
  });
});



// ============================================================
// MONTHLY STATS (Grouped by Week of Month)
// ============================================================

export const getMonthlyStats = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const result = await Session.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        startTime: { $gte: start }
      }
    },
    {
      $project: {
        week: {
          $concat: [
            "Week ",
            {
              $toString: {
                $ceil: { $divide: [{ $dayOfMonth: "$startTime" }, 7] }
              }
            }
          ]
        },
        hours: { $divide: ["$totalFocusSeconds", 3600] },
        completed: 1
      }
    },
    {
      $group: {
        _id: "$week",
        hours: { $sum: "$hours" },
        sessions: {
          $sum: {
            $cond: [{ $eq: ["$completed", true] }, 1, 0]
          }
        }
      }
    }
  ]);

  const monthly = {};

  result.forEach(r => {
    monthly[r._id] = {
      hours: r.hours,
      sessions: r.sessions
    };
  });

  res.json({
    success: true,
    monthly
  });
});