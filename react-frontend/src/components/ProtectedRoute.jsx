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
    const { user, authLoading } = useAuth();

    // 1) If still loading localStorage check, we can show a spinner or just return null
    if (authLoading) {
        return null; // or <LoadingSpinner />
    }

    // 2) If user is definitely null, redirect
    if (!user) {
        // Redirect to homepage
        return <Navigate to="/" replace />;
    }

    // 3) Otherwise render the page
    return children;
}
