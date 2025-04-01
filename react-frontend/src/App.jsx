// react-frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1) Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
// 2) Import our ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

// 3) Import the Layout & pages
import Layout from "./components/layout/Layout";
import HomePage from "./HomePage";
import HelpPage from "./HelpPage";
import DashboardPage from "./DashboardPage";
import TeamViewPage from "./TeamViewPage";
import LeaguesPage from "./LeaguesPage";
import TrashTalkPage from "./TrashTalkPage";
import ChallengePage from "./ChallengePage";
import PasswordResetPage from "./PasswordResetPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="forgot-password" element={<PasswordResetPage />} />

            {/* Protected routes for logged-in users only */}
            <Route
              path="dashboard/teamView"
              element={
                <ProtectedRoute>
                  <TeamViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/leagues"
              element={
                <ProtectedRoute>
                  <LeaguesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/trashTalk"
              element={
                <ProtectedRoute>
                  <TrashTalkPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/challenge"
              element={
                <ProtectedRoute>
                  <ChallengePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
