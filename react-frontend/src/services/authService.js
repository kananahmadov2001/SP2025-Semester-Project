// react-frontend/src/services/authService.js
const API_BASE_URL = "http://localhost:3000/api";
// Adjust if your Next.js runs elsewhere (e.g. production domain).

/**
 * Logs in the user. The server sets an HTTP-only cookie upon success.
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} data from server: { message, userId, name }
 */
export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // crucial for receiving/sending the cookie
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        // The server might return { error: "some error message" }
        throw new Error(data.error || "Login failed");
    }

    // We do NOT return a token. The token is in the httpOnly cookie.
    // The server returns { message, userId, name } upon success.
    return data;
}

/**
 * Registers a new user. The server may also set a cookie if it auto-logs in.
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} data from server: { message }
 */
export async function register(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Registration failed");
    }

    // The server returns { message } upon success
    return data;
}
