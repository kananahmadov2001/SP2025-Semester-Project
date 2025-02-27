// react-frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import the Layout
import Layout from "./components/layout/Layout";

// Import all the pages
import HomePage from "./HomePage";
import DashboardPage from "./DashboardPage";
import TeamViewPage from "./TeamViewPage";
import TrashTalkPage from "./TrashTalkPage";
import ChallengePage from "./ChallengePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 
          Wrap your entire application (or the portion that shares the layout) 
          in a Route that renders <Layout /> 
        */}
        <Route path="/" element={<Layout />}>
          {/* These are child routes that will render in <Outlet /> inside Layout */}
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/teamView" element={<TeamViewPage />} />
          <Route path="dashboard/trashTalk" element={<TrashTalkPage />} />
          <Route path="dashboard/challenge" element={<ChallengePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
