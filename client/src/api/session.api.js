import { apiClient } from "./api-client";

export const startSessionApi = (data) =>
  apiClient.post("/sessions/start", data);

export const getCurrentSessionApi = () =>
  apiClient.get("/sessions/current");

export const videoEventApi = (data) =>
  apiClient.post("/sessions/video-event", data);

export const completeSessionApi = (sessionId) =>
  apiClient.post(`/sessions/complete/${sessionId}`);

export const resetSessionApi = (sessionId) =>
  apiClient.post(`/sessions/reset/${sessionId}`);

export const heartbeatApi = (sessionId) =>
  apiClient.post(`/sessions/heartbeat/${sessionId}`);