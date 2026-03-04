import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authUser = (req, res, next) => {
  const token = req.cookies?.token;

  // 1️ No token provided
  if (!token) {
    return next(new AppError("Not authenticated. Please login.", 401));
  }

  // 2️ Ensure JWT secret exists
  if (!process.env.JWT_SECRET) {
    return next(new AppError("Server configuration error", 500));
  }

  try {
    // 3️ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️ Validate payload structure
    if (!decoded || !decoded.userId) {
      return next(new AppError("Invalid token payload", 401));
    }

    // 5️ Attach user to request
    req.user = {
      userId: decoded.userId
    };

    next();

  } catch (err) {
    // 6️ Token invalid or expired
    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authUser;
