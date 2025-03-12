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

      {/* Start Team Section */}
      <section className="visual-field-section">
        <h2>Starting Team Players</h2>
        <BasketballField />
      </section>
      
      {/* Leaderboards & Fixtures Section */}
      <section className="leaderboard-section">
        <LeaderboardSection />
      </section>

      {/* Create & Join League Section */}
      <section className="draft-trash-section">
        {/* Left Side: Create a League */}
        <div className="draft-container">
          <h2 className="draft-heading">Start Your Own HFL League</h2>
          <p className="draft-description">
            Gather your friends and set up your own private league. 
            Customize your league settings, invite players, and compete 
            to determine the ultimate HFL champion.
          </p>

          <div className="draft-btn-container">
            <button className="draft-btn" onClick={navToTeamView}>
              <i className="fas fa-user-plus"></i> Create a League
            </button>
          </div>
        </div>
        {/* Vertical Line Divider */}
        <div className="divider"></div>
        {/* Right Side: Join a League */}
        <div className="chat-container">
          <h2 className="chat-heading">Join an Existing HFL League</h2>
          <p className="chat-description">
            Looking for competition? Join an existing league and test 
            your skills against others. Enter a league code to get started 
            and show off your HFL expertise.
          </p>

          <div className="chat-btn-container">
            <button className="chat-btn" onClick={navToTrashTalk}>
              <i className="fas fa-user-plus"></i> Join a League
            </button>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="draft-trash-section">
        {/* Left Side: Global Chat Notifications */}
        <div className="draft-container">
          <h2 className="not-heading">Global Chat Notifications</h2>
          <p className="draft-description">
            Stay updated on the latest trash talk, heated debates, and trending discussions
            happening across all HFL leagues. Don't miss out on the biggest call-outs!
          </p>
          <div className="draft-btn-container">
            <button className="not-btn" onClick={navToTrashTalk}>
              <i className="fas fa-bell"></i> View Global Chat
            </button>
          </div>
        </div>
        {/* Vertical Line Divider */}
        <div className="divider2"></div>
        {/* Right Side: League Chat Notifications */}
        <div className="chat-container">
          <h2 className="not-heading">League Chat Notifications</h2>
          <p className="chat-description">
            Get real-time updates from your private league chat. See what your competitors
            are saying, engage in the latest debates, and keep the banter going strong!
          </p>

          <div className="chat-btn-container">
            <button className="not-btn" onClick={navToTrashTalk}>
              <i className="fas fa-bell"></i> View League Chat
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}

export default DashboardPage;
