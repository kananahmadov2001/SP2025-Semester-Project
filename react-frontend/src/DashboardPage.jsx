// react-frontend/src/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import "./DashboardPage.css";
import LeaderboardSection from "./LeaderboardSection";
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

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <h1>Your Dashboard</h1>
        {/* Show the user's name */}
        <div className="user-info">
          {userName && <span className="username">{userName}</span>}
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Leaderboards & Fixtures Section */}
      <section className="leaderboard-section">
        <button onClick={navToTeamView}>
          Create Your Team
        </button>
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

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-links-container">
          <div className="footer-column">
            <h3 className="footer-heading">Explore</h3>
            <a href="#">NBA Players</a>
            <a href="#">Teams</a>
            <a href="#">Fantasy Leaderboards</a>
            <a href="#">Draft Guide</a>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Game Info</h3>
            <a href="#">How to Play</a>
            <a href="#">Scoring Rules</a>
            <a href="#">Weekly Challenges</a>
            <a href="#">FAQs</a>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Community</h3>
            <a href="#">Forums</a>
            <a href="#">Events</a>
            <a href="#">Trash Talk Zone</a>
            <a href="#">Contact Support</a>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">About</h3>
            <a href="#">Our Story</a>
            <a href="#">Press</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className="footer-social-container">
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-square social-icon"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter social-icon"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram social-icon"></i>
            </a>
          </div>
        </div>

        <p className="footer-copyright">
          &copy; 2025 Hater Fantasy League. All rights reserved.
          <a href="#">Privacy Policy</a> | <a href="#">Terms</a> | <a href="#">Site Map</a>
        </p>
      </footer>
    </div>
  );
}

export default DashboardPage;
