import { apiClient } from "./api-client";

export const registerApi = (data) =>
  apiClient.post("/auth/register", data);

export const loginApi = (data) =>
  apiClient.post("/auth/login", data);

export const logoutApi = () =>
  apiClient.post("/auth/logout");

export const getMeApi = () =>
  apiClient.get("/auth/me");