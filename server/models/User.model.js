import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    focusLength: {
      type: Number,
      default: 25
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata"
    },

    // -------- STATS --------
    totalSessions: {
      type: Number,
      default: 0,
    },

    totalFocusMinutes: {
      type: Number,
      default: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    points: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1
    },

    // -------- SPECIAL COUNTERS --------
    earlyBirdCount: {
      type: Number,
      default: 0,
    },

    nightOwlCount: {
      type: Number,
      default: 0,
    },

    weekendSessionCount: {
      type: Number,
      default: 0,
    },

    perfectDayCount: {
      type: Number,
      default: 0,
    },

    lastSessionDate: {
      type: Date,
    },
    lastActiveAt: {
      type: Date
    }

  },
  { timestamps: true }
);

userSchema.index({ points: -1 }); // leaderboard sorting
userSchema.index({ totalSessions: -1 });

export default mongoose.model("User", userSchema);
