import { apiClient } from "./api-client";

export const getLeaderboardApi = () =>
  apiClient.get("/leaderboard/leaderboard");