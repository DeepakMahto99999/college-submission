import { apiClient } from "./api-client";

export const getDashboardOverviewApi = () =>
  apiClient.get("/dashboard/overview");