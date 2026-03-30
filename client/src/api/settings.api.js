import { apiClient } from "./api-client";

export const getSettingsApi = () =>
  apiClient.get("/settings");

export const updateSettingsApi = (data) =>
  apiClient.post("/settings", data); 