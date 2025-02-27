// react-frontend/src/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import "./DashboardPage.css";
import LeaderboardSection from "./LeaderboardSection";
import BasketballField from './BasketballField';
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch the user's name & ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedUserId) setUserId(storedUserId);
    if (storedName) setUserName(storedName);
  }, []);

  function handleSignOut() {
    // Clear localStorage or remove tokens
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    // Navigate to HomePage
    navigate("/");
  }

  function navToTeamView() {
    navigate("/dashboard/teamView");
  }

  function navToTrashTalk() {
    navigate("/dashboard/trashTalk");
  }

  return (
    <div className="dashboard-container">

      {/* Visual Field Section */}
      <section className="visual-field-section">
        <BasketballField />
      </section>
      
      {/* Leaderboards & Fixtures Section */}
      <section className="leaderboard-section">
        <LeaderboardSection />
      </section>

      {/* Draft & Trash Talk Section */}
      <section className="draft-trash-section">
        {/* Left Side: Draft Players */}
        <div className="draft-container">
          <h2 className="draft-heading">Draft Your Ultimate Flop Squad</h2>
          <p className="draft-description">
            Pick the players you think will tank the hardest this week.
            Outscore your rivals by drafting the worst-performing stars.
          </p>

          <div className="draft-btn-container">
            <button className="draft-btn" onClick={navToTeamView}>
              <i className="fas fa-user-plus"></i> Draft Your Players
            </button>
          </div>
        </div>

        {/* Vertical Line Divider */}
        <div className="divider"></div>

        {/* Right Side: Trash Talk Zone */}
        <div className="chat-container">
          <h2 className="chat-heading">Talk Trash, Call Out the Flops</h2>
          <p className="chat-description">
            No mercy. No excuses. Drop your hot takes and roast the worst performances of the week.
          </p>

          <div className="chat-btn-container">
            <button className="chat-btn" onClick={navToTrashTalk}>
              <i className="fas fa-comments"></i> Enter the Trash Talk Zone
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
