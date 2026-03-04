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
    enum: ["ARMED", "RUNNING", "COMPLETED", "INVALID"],
    default: "ARMED",
  },

  // TIMER AUTHORITY
  startTime: Date,
  lastHeartbeatAt: Date,

  totalFocusSeconds: {
    type: Number,
    default: 0
  },

  // VIDEO CONTEXT
  activeVideoId: String,

  // SESSION-LEVEL AI CACHE
  validatedVideos: {
    type: Map,
    of: new mongoose.Schema({
      decision: {
        type: String,
        enum: ["VALID", "INVALID", "VALID_LOW_CONFIDENCE"]
      },
      confidence: Number,
      reason: String
    }, { _id: false }),
    default: {}
  },

  // TAB ABUSE TRACKING
  totalHiddenSeconds: { type: Number, default: 0 },
  hiddenEventCount: { type: Number, default: 0 },
  lastHiddenStart: Date,

  // PAUSE ABUSE TRACKING
  totalPauseSeconds: { type: Number, default: 0 },
  pauseEventCount: { type: Number, default: 0 },
  lastPauseStart: Date,

  // RECOVERY WINDOW
  recoveryWindowEndsAt: Date,

  recoveryActive: {
    type: Boolean,
    default: false
  },

  recoveryCount: {
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
      "EXCESSIVE_TAB_AWAY",
      "PAUSE_ABUSE",
      "SHORTS_NOT_ALLOWED",
      "MANUAL_CANCEL",
      "AI_LOW_CONFIDENCE",
      "NETWORK_ABORT",
    ]
  },

}, {
  timestamps: true,
  optimisticConcurrency: true
});

//  Frequently used queries
sessionSchema.index({ userId: 1, status: 1 });
sessionSchema.index({ userId: 1, createdAt: -1 });

//  Dashboard / stats queries
sessionSchema.index({ userId: 1, completed: 1, startTime: -1 });


export default mongoose.model("Session", sessionSchema);
