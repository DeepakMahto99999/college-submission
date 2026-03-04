import mongoose from "mongoose";
import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import Achievement from "../models/Achievement.model.js";
import UserAchievement from "../models/UserAchievement.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";

export const getDashboardOverview = asyncHandler(async (req, res) => {

  const userId = req.user.userId;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // ================= DATE RANGES =================
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  // ================= PARALLEL FETCH =================
  const [
    user,
    todayAgg,
    weekAgg,
    recentSessions,
    allAchievements,
    unlockedAchievements
  ] = await Promise.all([

    User.findById(userId).lean(),

    // TODAY AGGREGATION
    Session.aggregate([
      {
        $match: {
          userId: userObjectId,
          completed: true,
          startTime: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          totalSeconds: { $sum: "$totalFocusSeconds" },
          count: { $sum: 1 }
        }
      }
    ]),

    // WEEK AGGREGATION
    Session.aggregate([
      {
        $match: {
          userId: userObjectId,
          completed: true,
          startTime: { $gte: weekStart }
        }
      }
    ]),

    // RECENT SESSIONS
    Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Achievement.find({ isActive: true }).lean(),

    UserAchievement.find({ userId })
      .select("achievementId unlockedAt")
      .lean()
  ]);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // ================= TODAY STATS =================
  const todayFocusMinutes =
    todayAgg[0]?.totalSeconds
      ? Math.round(todayAgg[0].totalSeconds / 60)
      : 0;

  const todaySessionsCount =
    todayAgg[0]?.count || 0;

  // ================= WEEKLY PROGRESS =================
  const daily = {
    Mon: 0, Tue: 0, Wed: 0,
    Thu: 0, Fri: 0, Sat: 0, Sun: 0
  };

  let totalMinutesThisWeek = 0;

  weekAgg.forEach(s => {

    if (!s.startTime) return;

    const day = s.startTime.toLocaleDateString(
      "en-US",
      { weekday: "short" }
    );

    const minutes = (s.totalFocusSeconds || 0) / 60;

    if (daily[day] !== undefined) {
      daily[day] += minutes;
    }

    totalMinutesThisWeek += minutes;
  });

  // ================= RECENT TIMELINE =================
  const timeline = recentSessions.map(s => ({
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

  // ================= INSIGHTS =================
  const hourBucket = {};
  const dayBucket = {};

  weekAgg.forEach(s => {

    if (!s.startTime) return;

    const hour = s.startTime.getHours();
    hourBucket[hour] = (hourBucket[hour] || 0) + 1;

    const day = s.startTime.toLocaleDateString(
      "en-US",
      { weekday: "long" }
    );

    dayBucket[day] =
      (dayBucket[day] || 0) + (s.totalFocusSeconds || 0);
  });

  // Efficient max finder (no sorting)
  let peakHour = 0;
  let maxHourCount = 0;

  for (const [hour, count] of Object.entries(hourBucket)) {
    if (count > maxHourCount) {
      maxHourCount = count;
      peakHour = hour;
    }
  }

  let bestDay = "N/A";
  let maxDayValue = 0;

  for (const [day, value] of Object.entries(dayBucket)) {
    if (value > maxDayValue) {
      maxDayValue = value;
      bestDay = day;
    }
  }

  // ================= ACHIEVEMENTS PREVIEW =================
  const unlockedCount = unlockedAchievements.length;
  const totalCount = allAchievements.length;

  // ================= RESPONSE =================
  res.json({
    success: true,

    summary: {
      totalFocusMinutes: user.totalFocusMinutes,
      totalSessions: user.totalSessions,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      todayFocusMinutes,
      todaySessions: todaySessionsCount
    },

    weeklyProgress: {
      totalMinutesThisWeek: Math.round(totalMinutesThisWeek),
      daily
    },

    recentSessions: timeline,

    insights: {
      peakHourRange: `${peakHour}-${Number(peakHour) + 2}`,
      bestDay
    },

    achievementsPreview: {
      unlockedCount,
      totalCount
    }
  });
});