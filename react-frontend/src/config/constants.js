// react-frontend/src/config/constants.js

/**
 * Here you can manage all your endpoints and environment-based settings in one place.
 */

// Base URL of your Next.js backend.
export const API_BASE_URL = "http://localhost:3000";

// If your backend is at /api, you can keep it separate or combine it:
export const API_URL = `${API_BASE_URL}/api`;

// Example endpoints for auth:
export const AUTH_LOGIN_URL = `${API_URL}/auth/login`;
export const AUTH_REGISTER_URL = `${API_URL}/auth/register`;

// Example endpoints for fantasy:
export const FANTASY_ADD_URL = `${API_URL}/fantasy/add`;
export const FANTASY_REMOVE_URL = `${API_URL}/fantasy/remove`;
export const FANTASY_TEAM_URL = `${API_URL}/fantasy/team`;

// Example endpoint for players:
export const PLAYERS_URL = `${API_URL}/players`;

export const LEADERBOARD_URL = `${API_URL}/leaderboard`;

// Add more as needed in the future, for example:
// export const PLAYER_STATS_URL = `${API_URL}/player-stats`;
// export const FANTASY_SCORE_URL = `${API_URL}/fantasy/score`;
