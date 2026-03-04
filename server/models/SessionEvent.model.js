import mongoose from "mongoose";

const sessionEventSchema = new mongoose.Schema({

  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  eventId: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    required: true,
    enum: [
      "VIDEO_DETECTED",
      "TAB_HIDDEN_START",
      "TAB_HIDDEN_END",
      "PAUSE_START",
      "PAUSE_END",
      "HEARTBEAT",
      "SHORTS_DETECTED"
    ]
  },

  videoId: String,

  videoTitle: String,

  videoDescription: {
    type: String,
    maxlength: 1000
  },

  clientTimestamp: Date,

  serverTimestamp: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true }); 

sessionEventSchema.index({ sessionId: 1 });
sessionEventSchema.index({ userId: 1 });
sessionEventSchema.index({ serverTimestamp: -1 });

sessionEventSchema.index(
  { serverTimestamp: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 } // 30 days
);

export default mongoose.model("SessionEvent", sessionEventSchema);
