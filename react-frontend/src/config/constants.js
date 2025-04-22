// react-frontend/src/config/constants.js

// Base URL of the Next.js backend.
export const API_BASE_URL = "http://localhost:3000";

// If the backend is at /api, you can keep it separate or combine it:
export const API_URL = `${API_BASE_URL}/api`;

// Endpoints for auth:
export const AUTH_LOGIN_URL = `${API_URL}/auth/login`;
export const AUTH_REGISTER_URL = `${API_URL}/auth/register`;

// Endpoints for fantasy:
export const FANTASY_ADD_URL = `${API_URL}/fantasy/add`;
export const FANTASY_REMOVE_URL = `${API_URL}/fantasy/remove`;
export const FANTASY_TEAM_URL = `${API_URL}/fantasy/team`;
export const PLAYER_SCORE_URL = `${API_URL}/fantasy/scores`;
export const TOP_5_PLAYERS_URL = `${API_URL}/top-players`;

// Endpoint for players:
export const PLAYERS_URL = `${API_URL}/players`;

export const LEADERBOARD_URL = `${API_URL}/leaderboard`;
export const LEAGUES_URL = `${API_URL}/leagues`;

export const CHAT_URL = `${API_URL}/chat`;
