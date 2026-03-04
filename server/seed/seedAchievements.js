import mongoose from "mongoose";
import dotenv from "dotenv";
import Achievement from "../models/Achievement.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const achievements = [
  {
    title: "First Session",
    description: "Complete your first focus session",
    conditionType: "TOTAL_SESSIONS",
    threshold: 1,
    category: "FOCUS",
  },
  {
    title: "5 Sessions",
    description: "Complete 5 focus sessions",
    conditionType: "TOTAL_SESSIONS",
    threshold: 5,
    category: "FOCUS",
  },
  {
    title: "Focus Master",
    description: "Complete 25 sessions",
    conditionType: "TOTAL_SESSIONS",
    threshold: 25,
    category: "FOCUS",
  },
  {
    title: "Century Mark",
    description: "Complete 100 sessions",
    conditionType: "TOTAL_SESSIONS",
    threshold: 100,
    category: "FOCUS",
  },
  {
    title: "50 Hours Club",
    description: "Accumulate 50 hours of focus time",
    conditionType: "TOTAL_MINUTES",
    threshold: 3000,
    category: "TIME",
  },
  {
    title: "1 Week Streak",
    description: "Maintain 7 day streak",
    conditionType: "CURRENT_STREAK",
    threshold: 7,
    category: "STREAK"
  },
  {
    title: "Month Warrior",
    description: "Maintain 30 day streak",
    conditionType: "CURRENT_STREAK",
    threshold: 30,
    category: "STREAK"
  },
  {
    title: "Early Bird",
    description: "Complete sessions before 7 AM",
    conditionType: "EARLY_BIRD",
    threshold: 5,
    category: "SPECIAL",
  },
  {
    title: "Night Owl",
    description: "Complete sessions after 11 PM",
    conditionType: "NIGHT_OWL",
    threshold: 5,
    category: "SPECIAL",
  },
  {
    title: "Weekend Warrior",
    description: "Complete sessions on weekends",
    conditionType: "WEEKEND",
    threshold: 5,
    category: "SPECIAL",
  },
  {
    title: "Perfect Day",
    description: "Complete multiple sessions in a single day",
    conditionType: "PERFECT_DAY",
    threshold: 8,
    category: "SPECIAL",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Clearing old achievements...");
    await Achievement.deleteMany(); // wipe old


    await Achievement.insertMany(achievements);

    console.log("Achievements seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();