import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser
} from "../controllers/auth.controller.js";

import authUser from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);
router.post("/logout", authUser, logoutUser);
router.get("/me", authUser, getMe);

export default router;
