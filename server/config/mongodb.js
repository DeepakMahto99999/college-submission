import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    logger.info("MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB runtime error", { message: err.message });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

  } catch (error) {
    logger.error("MongoDB connection failed", {
      message: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};

export default connectDB;
