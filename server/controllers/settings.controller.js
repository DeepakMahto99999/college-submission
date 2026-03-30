import UserSettings from "../models/UserSettings.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";


// ================= GET SETTINGS =================

export const getSettings = asyncHandler(async (req, res) => {

    const userId = req.user.userId;

    let settings = await UserSettings.findOne({ userId });

    if (!settings) {

        settings = await UserSettings.create({
            userId
        });

    }

    res.json({
        success: true,
        settings
    });

});


// ================= UPDATE SETTINGS =================

export const updateSettings = asyncHandler(async (req, res) => {

    const userId = req.user.userId;

    const {
        hideShorts,
        hideHome,
        hideComments,
        hideRecommendations,
        hideSidebar
    } = req.body;

    const settings = await UserSettings.findOneAndUpdate(

        { userId },

        {
            hideShorts,
            hideHome,
            hideComments,
            hideRecommendations,
            hideSidebar
        },

        {
            new: true,
            upsert: true
        }

    );

    res.json({
        success: true,
        settings
    });

});