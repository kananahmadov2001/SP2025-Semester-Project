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
import DashboardPage from "./DashboardPage";
import TeamViewPage from "./TeamViewPage";
import TrashTalkPage from "./TrashTalkPage";
import ChallengePage from "./ChallengePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />

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
