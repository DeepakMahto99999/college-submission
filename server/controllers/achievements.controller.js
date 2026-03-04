import Achievement from "../models/Achievement.model.js";
import UserAchievement from "../models/UserAchievement.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";
import Session from '../models/Session.model.js'


// GET ALL ACHIEVEMENTS (GLOBAL LIST)
export const getAllAchievements = asyncHandler(async (req, res) => {

  const achievements = await Achievement.find({ isActive: true })
    .sort({ threshold: 1 })
    .lean();

  res.json({
    success: true,
    data: achievements
  });
});



//  DASHBOARD PREVIEW VERSION
export const getAchievementPreview = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const [achievements, unlockedDocs, user] = await Promise.all([
    Achievement.find({ isActive: true }).lean(),
    UserAchievement.find({ userId }).select("achievementId").lean(),
    User.findById(userId).lean()
  ]);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const unlockedSet = new Set(
    unlockedDocs.map(a => a.achievementId.toString())
  );

  const inProgress = [];

  for (const ach of achievements) {

    if (unlockedSet.has(ach._id.toString())) continue;

    let progress = 0;

    switch (ach.conditionType) {

      case "TOTAL_SESSIONS":
        progress = user.totalSessions;
        break;

      case "TOTAL_MINUTES":
        progress = user.totalFocusMinutes;
        break;

      case "CURRENT_STREAK":
        progress = user.currentStreak;
        break;

      case "LONGEST_STREAK":
        progress = user.longestStreak;
        break;

      case "EARLY_BIRD":
        progress = user.earlyBirdCount || 0;
        break;

      case "NIGHT_OWL":
        progress = user.nightOwlCount || 0;
        break;

      case "WEEKEND":
        progress = user.weekendSessionCount || 0;
        break;

      case "PERFECT_DAY":
        progress = user.perfectDayCount || 0;
        break;

      default:
        progress = 0;
    }

    inProgress.push({
      achievementId: ach._id.toString(),
      progress,
      target: ach.threshold
    });
  }

  res.json({
    success: true,
    data: {
      unlockedCount: unlockedSet.size,
      totalCount: achievements.length,
      unlockedIds: [...unlockedSet],
      inProgress
    }
  });
});



export const checkAndUnlockAchievements = async (
  userId,
  session,
  mongoSession = null
) => {
   console.log("CALLING UNLOCK FUNCTION");
  const user = await User.findById(userId).session(mongoSession);
  if (!user) return;

  const achievements = await Achievement
    .find({ isActive: true })
    .session(mongoSession);

  const unlocked = await UserAchievement
    .find({ userId })
    .session(mongoSession);

  const unlockedSet = new Set(
    unlocked.map(a => a.achievementId.toString())
  );

  for (const ach of achievements) {

    if (unlockedSet.has(ach._id.toString())) continue;

    let qualifies = false;

    switch (ach.conditionType) {

      case "TOTAL_SESSIONS":
        qualifies = user.totalSessions >= ach.threshold;
        break;

      case "TOTAL_MINUTES":
        qualifies = user.totalFocusMinutes >= ach.threshold;
        break;

      case "CURRENT_STREAK":
        qualifies = user.currentStreak >= ach.threshold;
        break;

      case "LONGEST_STREAK":
        qualifies = user.longestStreak >= ach.threshold;
        break;

      case "EARLY_BIRD":
        qualifies = (user.earlyBirdCount || 0) >= ach.threshold;
        break;

      case "NIGHT_OWL":
        qualifies = (user.nightOwlCount || 0) >= ach.threshold;
        break;

      case "WEEKEND":
        qualifies = (user.weekendSessionCount || 0) >= ach.threshold;
        break;

      case "PERFECT_DAY":
        qualifies = (user.perfectDayCount || 0) >= ach.threshold;
        break;

      default:
        qualifies = false;
    }

    console.log("---- Achievement Debug ----");
    console.log("Title:", ach.title);
    console.log("Condition Type:", ach.conditionType);
    console.log("User totalSessions:", user.totalSessions);
    console.log("Threshold:", ach.threshold);
    console.log("Qualifies:", qualifies);
    console.log("----------------------------");

    if (qualifies) {

      await UserAchievement.create([{
        userId,
        achievementId: ach._id,
        sourceSessionId: session._id,
        unlockedAt: new Date()
      }], { session: mongoSession });

      // Optional: Add reward points automatically
      if (ach.rewardPoints > 0) {
        user.points += ach.rewardPoints;
      }
    }
  }

  await user.save({ session: mongoSession });
};
