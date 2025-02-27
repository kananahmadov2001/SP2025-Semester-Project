// react-frontend/src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * usage:
 *   <ProtectedRoute>
 *     <SomeProtectedPage />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    // If user is null => not logged in => redirect
    if (!user) {
        // Redirect to homepage
        return <Navigate to="/" replace />;
    }

    return children;
}
