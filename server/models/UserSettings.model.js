import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  hideShorts: {
    type: Boolean,
    default: false
  },

  hideHome: {
    type: Boolean,
    default: false
  },

  hideComments: {
    type: Boolean,
    default: false
  },

  hideRecommendations: {
    type: Boolean,
    default: false
  },

  hideSidebar: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("UserSettings", userSettingsSchema);