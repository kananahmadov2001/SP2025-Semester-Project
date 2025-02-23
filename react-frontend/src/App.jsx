import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import DashboardPage from "./DashboardPage";
import DraftPlayerPage from "./DraftPlayerPage";
import TrashTalkPage from "./TrashTalkPage";
import ChallengePage from "./ChallengePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<HomePage />} />
        {/* Dashboard Page Route */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Draft Player Page Route */}
        <Route path="/dashboard/draftPlayer" element={<DraftPlayerPage />} />
        {/* Trash Talk Page Route */}
        <Route path="/dashboard/trashTalk" element={<TrashTalkPage />} />
        {/* Challenge Page Route */}
        <Route path="/dashboard/challenge" element={<ChallengePage />} />
      </Routes>
    </Router>
  );
}

export default App;
