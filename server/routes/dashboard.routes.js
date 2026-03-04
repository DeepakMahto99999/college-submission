import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import { getDashboardOverview } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/overview", authUser, getDashboardOverview);

export default router;
