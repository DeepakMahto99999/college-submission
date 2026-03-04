import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";


//  TOKEN GENERATOR (Reusable)
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


//  COOKIE SETTER (Reusable)
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,   // since you're on http
    sameSite: "lax",  // IMPORTANT
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};



// ================= REGISTER =================
const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body; 

  console.log("REQ BODY IN CONTROLLER:", req.body);

  const normalizedEmail = email.trim().toLowerCase();

  const exists = await UserModel.findOne({ email: normalizedEmail }).lean();

  if (exists) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await UserModel.create({
    name,
    email: normalizedEmail,
    password: hashedPassword
  });

  const token = generateToken(user._id);
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});



// ================= LOGIN =================
export const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await UserModel
    .findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user._id);
  setAuthCookie(res, token);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});



// ================= LOGOUT =================
export const logoutUser = asyncHandler(async (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

  res.json({
    success: true,
    message: "Logged out"
  });
}); 

export const getMe = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.userId)
    .select("name email");

  res.json({
    success: true,
    data: { user }
  });
}); 
