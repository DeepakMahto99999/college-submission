import mongoose from "mongoose";

const aiCacheSchema = new mongoose.Schema({

  videoId: {
    type: String,
    required: true
  },

  topic: {
    type: String,
    required: true
  },


  confidence: {
    type: Number,
    default: 0
  },

  reason: String,

  checkedAt: {
    type: Date,
    default: Date.now
  }

});

aiCacheSchema.index({ videoId: 1, topic: 1 }, { unique: true });

export default mongoose.model("AiCache", aiCacheSchema);
