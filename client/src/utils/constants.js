export const HOST = import.meta.env.VITE_SERVER_URL;


// BASE 
export const API_BASE = `${HOST}/api`;


// AUTH 
export const AUTH_BASE = `${API_BASE}/auth`;

export const SIGNUP_ROUTE = `${AUTH_BASE}/register`;
export const LOGIN_ROUTE = `${AUTH_BASE}/login`;
export const LOGOUT_ROUTE = `${AUTH_BASE}/logout`;


// ================= SESSIONS =================
export const SESSION_BASE = `${API_BASE}/sessions`;

export const GET_CURRENT_SESSION_ROUTE = `${SESSION_BASE}/current`;
export const START_SESSION_ROUTE = `${SESSION_BASE}/start`;
export const VIDEO_EVENT_ROUTE = `${SESSION_BASE}/video-event`;
export const COMPLETE_SESSION_ROUTE = (sessionId) =>
    `${SESSION_BASE}/complete/${sessionId}`;

export const RESET_SESSION_ROUTE = (sessionId) =>
    `${SESSION_BASE}/reset/${sessionId}`;

export const HEARTBEAT_ROUTE = (sessionId) =>
    `${SESSION_BASE}/heartbeat/${sessionId}`;

export const SESSION_EVENT_ROUTE = (sessionId) =>
    `${SESSION_BASE}/${sessionId}/events`;


// ================= DASHBOARD =================
export const DASHBOARD_BASE = `${API_BASE}/dashboard`;

export const DASHBOARD_OVERVIEW_ROUTE =
    `${DASHBOARD_BASE}/overview`;


// ================= STATISTICS =================
export const STATISTICS_BASE = `${API_BASE}/statistics`;

export const TODAY_STATS_ROUTE = `${STATISTICS_BASE}/today`;
export const RECENT_SESSIONS_ROUTE = `${STATISTICS_BASE}/recent`;
export const WEEKLY_STATS_ROUTE = `${STATISTICS_BASE}/weekly`;
export const DAILY_PATTERN_ROUTE = `${STATISTICS_BASE}/daily-pattern`;
export const MONTHLY_STATS_ROUTE = `${STATISTICS_BASE}/monthly`;


// ================= ACHIEVEMENTS =================
export const ACHIEVEMENTS_BASE = `${API_BASE}/achievements`;

export const GET_ALL_ACHIEVEMENTS_ROUTE = `${ACHIEVEMENTS_BASE}/all`;
export const GET_ACHIEVEMENT_PREVIEW_ROUTE =
    `${ACHIEVEMENTS_BASE}/preview`;


// ================= LEADERBOARD =================
export const LEADERBOARD_BASE = `${API_BASE}/leaderboard`;

export const GET_LEADERBOARD_ROUTE =
    `${LEADERBOARD_BASE}/leaderboard`;