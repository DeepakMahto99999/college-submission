import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,

  conditionType: {
    type: String,
    enum: [
      "TOTAL_SESSIONS",
      "TOTAL_MINUTES",
      "CURRENT_STREAK",
      "LONGEST_STREAK",
      "EARLY_BIRD",
      "NIGHT_OWL",
      "WEEKEND",
      "PERFECT_DAY"
    ],
    required: true
  },

  threshold: {
    type: Number,
    required: true,
  },

  rewardPoints: {
    type: Number,
    default: 0,
  },

  icon: String,

  color: {
    type: String,
    default: "#FFD700", // gold default
  },

  rarity: {
    type: String,
    enum: ["COMMON", "RARE", "EPIC", "LEGENDARY"],
    default: "COMMON",
  },

  category: {
    type: String,
    enum: ["FOCUS", "STREAK", "TIME", "SPECIAL"],
  },

  isActive: {
    type: Boolean,
    default: true,
  },

});

achievementSchema.index({ isActive: 1 });

export default mongoose.model("Achievement", achievementSchema);
