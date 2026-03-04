import { apiClient } from "./api-client";

export const getTodayStatsApi = () =>
  apiClient.get("/statistics/today");

export const getRecentStatsApi = () =>
  apiClient.get("/statistics/recent");

export const getWeeklyStatsApi = () =>
  apiClient.get("/statistics/weekly");

export const getDailyPatternApi = () =>
  apiClient.get("/statistics/daily-pattern");

export const getMonthlyStatsApi = () =>
  apiClient.get("/statistics/monthly");