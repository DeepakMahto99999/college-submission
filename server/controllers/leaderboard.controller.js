import User from "../models/User.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";

// ===============================
// GET LEADERBOARD
// ===============================
export const getLeaderboard = asyncHandler(async (req, res) => {

  const userId = req.user.userId;

  const [topUsers, currentUser] = await Promise.all([

    User.find()
      .select("name avatar totalSessions currentStreak points")
      .sort({ points: -1, totalSessions: -1 })
      .limit(50)
      .lean(),

    User.findById(userId)
      .select("name avatar totalSessions currentStreak points")
      .lean()
  ]);

  if (!currentUser) {
    throw new AppError("User not found", 404);
  }

  const higherUsersCount = await User.countDocuments({
    points: { $gt: currentUser.points }
  });

  const currentRank = higherUsersCount + 1;

  const leaderboard = topUsers.map(u => ({
    ...u,
    isCurrentUser: u._id.toString() === userId
  }));

  res.json({
    success: true,
    leaderboard,
    currentUser: {
      rank: currentRank,
      ...currentUser
    }
  });
});
