// react-frontend/src/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DashboardPage.css";
import LeaderboardSection from "./LeaderboardSection";
import BasketballField from "./BasketballField";

function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [starterPlayers, setStarterPlayers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user info from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedUserId) setUserId(storedUserId);
    if (storedName) setUserName(storedName);
  }, []);

  // Fetch starter players whenever userId or location changes
  useEffect(() => {
    async function fetchTeam() {
      if (!userId) return;
      try {
        const resp = await fetch(`/api/fantasy/team?userId=${userId}&t=${Date.now()}`, {
          credentials: "include",
        });
        const data = await resp.json();
        if (resp.ok && data.starters) {
          const normalized = data.starters.map(p => ({
            ...p,
            position: p.real_position, // normalize
          }));
          print("data: ", data);
          print("normalized: ", normalized);
          setStarterPlayers(normalized);
        } else {
          console.error("Failed to fetch team data:", data.error);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    }

    fetchTeam();
  }, [userId, location.pathname]);

  // Navigation helpers
  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const navToTeamView = () => navigate("/dashboard/teamView");
  const navToLeagues = () => navigate("/dashboard/leagues");
  const navToTrashTalk = () => navigate("/dashboard/trashTalk");

  return (
    <div className="dashboard-container">
      {/* Starter Players */}
      <section className="visual-field-section">
        <h2>Starting Team Players</h2>
        <BasketballField players={starterPlayers} />
      </section>

      {/* Leaderboard Section */}
      <section className="leaderboard-section">
        <LeaderboardSection />
      </section>

      {/* League Actions */}
      <section className="draft-trash-section">
        <div className="draft-container">
          <h2 className="draft-heading">Start Your Own HFL League</h2>
          <p className="draft-description">
            Gather your friends and set up your own private league.
            Customize your league settings, invite players, and compete
            to determine the ultimate HFL champion.
          </p>
          <div className="draft-btn-container">
            <button className="draft-btn" onClick={navToLeagues}>
              <i className="fas fa-user-plus"></i> Create a League
            </button>
          </div>
        </div>
        <div className="divider"></div>
        <div className="chat-container">
          <h2 className="chat-heading">Join an Existing HFL League</h2>
          <p className="chat-description">
            Looking for competition? Join an existing league and test
            your skills against others. Enter a league code to get started
            and show off your HFL expertise.
          </p>
          <div className="chat-btn-container">
            <button className="chat-btn" onClick={navToLeagues}>
              <i className="fas fa-user-plus"></i> Join a League
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="draft-trash-section">
        <div className="draft-container">
          <h2 className="not-heading">Global Chat Notifications</h2>
          <p className="draft-description">
            Stay updated on the latest trash talk, heated debates, and trending discussions
            happening across all HFL leagues. Don’t miss out on the biggest call-outs!
          </p>
          <div className="draft-btn-container">
            <button className="not-btn" onClick={navToTrashTalk}>
              <i className="fas fa-bell"></i> View Global Chat
            </button>
          </div>
        </div>
        <div className="divider2"></div>
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
