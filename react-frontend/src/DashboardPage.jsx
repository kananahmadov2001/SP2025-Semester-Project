// react-frontend/src/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import "./DashboardPage.css";
import LeaderboardSection from "./LeaderboardSection";
import SquadSelection from "./components/SquadSelection";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [userTeam, setUserTeam] = useState([]);
  const navigate = useNavigate();

  // Fetch the user's name & ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedUserId) setUserId(storedUserId);
    if (storedName) setUserName(storedName);
  }, []);

  // Fetch the user's current fantasy team from backend
  async function fetchUserTeam(userIdParam) {
    try {
      const response = await fetch(`/api/fantasy/team?userId=${userIdParam}`);
      const data = await response.json();
      if (response.ok && data.fantasyTeam) {
        setUserTeam(data.fantasyTeam);
      } else {
        console.error("Error fetching user team:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user team:", error);
    }
  }

  // On mount (and whenever userId changes), load the user's team
  useEffect(() => {
    if (userId) {
      fetchUserTeam(userId);
    }
  }, [userId]);

  // Add player with EXACT 5-SLOT ENFORCEMENT
  async function handleAddPlayer(player) {
    if (!userId) {
      alert("You must be logged in to add players.");
      return;
    }

    // Step A: Determine if this is front-court or back-court (TODO: this needs modification once the actual player data is determined)
    const isFrontCourt = player.position.includes("F") || player.position.includes("C");
    const isBackCourt = player.position.includes("G");

    // Step B: Count how many FC or BC players are already on the team
    const fcCount = userTeam.filter(
      (p) => p.position.includes("F") || p.position.includes("C")
    ).length;
    const bcCount = userTeam.filter((p) => p.position.includes("G")).length;

    if (isFrontCourt && fcCount >= 5) {
      alert("You already have 5 front-court players! Remove one before adding another.");
      return;
    }
    if (isBackCourt && bcCount >= 5) {
      alert("You already have 5 back-court players! Remove one before adding another.");
      return;
    }

    // Step C: Make the API call to add the player
    try {
      const response = await fetch("/api/fantasy/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), playerId: player.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add player");
      }

      alert(`Added ${player.name} to your team!`);
      // Re-fetch updated team
      await fetchUserTeam(userId);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Remove player from the user’s team
  async function handleRemovePlayer(playerId) {
    if (!userId) {
      alert("You must be logged in to remove players.");
      return;
    }

    try {
      const response = await fetch("/api/fantasy/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), playerId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove player");
      }

      alert("Player removed from your team!");
      // Re-fetch updated team
      await fetchUserTeam(userId);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function handleSignOut() {
    // Clear localStorage or remove tokens
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    // Navigate to HomePage
    navigate("/");
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

      {/* Create/View Squad Section */}
      <section className="dashboard-section squad-section">
        <h2>Create/View Squad</h2>
        {/*
          Pass the entire userTeam array to SquadSelection,
          along with the remove handler.
        */}
        <SquadSelection userTeam={userTeam} onRemovePlayer={handleRemovePlayer} />
      </section>

      {/* Leaderboards & Fixtures Section */}
      <section className="leaderboard-section">
        {/*
          Pass onAddPlayer callback to LeaderboardSection,
          so it can call handleAddPlayer when the user clicks "Add"
        */}
        <LeaderboardSection onAddPlayer={handleAddPlayer} />
      </section>

      {/* Chat Button Section */}
      <section className="dashboard-section chat-section">
        <h2 className="chat-heading">Talk Trash, Call Out the Flops</h2>
        <p className="chat-description">No mercy. No excuses. Drop your hot takes and roast the worst performances of the week.</p>

        <div className="chat-btn-container">
          <button className="chat-btn">
            <i className="fas fa-comments"></i> Enter the Trash Talk Zone
          </button>
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
