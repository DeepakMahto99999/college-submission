import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: true,
    },
    sourceSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null
    },

    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1 });
userAchievementSchema.index({ userId: 1, unlockedAt: -1 });

export default mongoose.model("UserAchievement", userAchievementSchema);
