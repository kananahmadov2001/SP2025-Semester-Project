// react-frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../services/authService";

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides:
 * - user state
 * - login(email, password)
 * - logout()
 * - auto-persistence in localStorage so the user remains after page refresh
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // 1) On first mount, check if we have 'user' in localStorage from a previous session
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // parse the user object
        }
    }, []);

    // 2) Whenever `user` changes, persist in localStorage (or remove if null)
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    /**
     * login() calls your existing backend API and updates the React context
     */
    async function login(email, password) {
        // Attempt the API call (from authService.js)
        const data = await apiLogin(email, password);
        // data = { message, userId, name }

        // We'll store only minimal info in `user`
        const newUser = {
            userId: data.userId,
            name: data.name,
        };
        setUser(newUser);
        // The httpOnly cookie is set by the server; we can't see it from JS, which is good (secure).
    }

    /**
     * logout() clears our local state. 
     * (We don’t have a backend logout route here, so the cookie remains, (TODO: make sure backend have the logout route)
     * but effectively, the front-end treats user as logged out.)
     */
    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Simple hook so we can do `const { user, login, logout } = useAuth()`
export function useAuth() {
    return useContext(AuthContext);
}
