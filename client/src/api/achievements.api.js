import { apiClient } from "./api-client";

export const getAllAchievementsApi = () =>
  apiClient.get("/achievements/all");

export const getAchievementsPreviewApi = () =>
  apiClient.get("/achievements/preview");
