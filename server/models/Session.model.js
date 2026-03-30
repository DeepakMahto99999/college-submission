import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  topic: {
    type: String,
    required: true,
  },

  focusLength: {
    type: Number, // minutes
    required: true
  },

  status: {
    type: String,
    enum: ["RUNNING", "COMPLETED", "INVALID"],
    default: "RUNNING",
  },

  startTime: {
    type: Date,
    default: Date.now
  },

  endTime: Date,

  totalFocusSeconds: {
    type: Number,
    default: 0
  },

  completed: {
    type: Boolean,
    default: false,
  },

  invalidReason: {
    type: String,
    enum: [
      "TOPIC_MISMATCH",
      "MANUAL_CANCEL",
      "SHORTS_BLOCKED"
    ]
  },

}, {
  timestamps: true
});


// 🔥 INDEXES (important for dashboard performance)
sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ userId: 1, completed: 1, startTime: -1 });

export default mongoose.model("Session", sessionSchema);