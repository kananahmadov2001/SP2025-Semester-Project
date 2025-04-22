// react-frontend/src/DashboardPage.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BasketballField from "./BasketballField";
import LeaderboardSection from "./LeaderboardSection";
import { UseAuth } from "./context/AuthContext";
import useFantasyTeam from "./hooks/useFantasyTeam";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, logout } = UseAuth();          // ← single source of truth
  const navigate = useNavigate();
  const location = useLocation();

  // Custom hook keeps the data logic out of the component
  const { starters, loading: startersLoading } = useFantasyTeam(user?.userId);

  /* ---------------------------------------------------------------- */
  /* Navigation helpers                                               */
  /* ---------------------------------------------------------------- */
  const navToTeamView = () => navigate("/dashboard/teamView");
  const navToLeagues = () => navigate("/dashboard/leagues");
  const navToTrashTalk = () => navigate("/dashboard/trashTalk");

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="dashboard-container">
      {/* =============== Starters / Court View =============== */}
      <section className="visual-field-section">
        <h2>Starting Team Players</h2>

        {user ? (
          startersLoading ? (
            <p>Loading your starters…</p>
          ) : starters.length ? (
            <BasketballField players={starters} />
          ) : (
            <p>You haven’t selected any starters yet.</p>
          )
        ) : (
          <p>Log in to see your starting five.</p>
        )}
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
              <i className="fas fa-user-plus" /> Create a League
            </button>
          </div>
        </div>

        <div className="divider" />

        {/* -------- Global Chat -------- */}
        <div className="chat-container">
          <h2 className="chat-heading">Join an Existing HFL League</h2>
          <p className="chat-description">
            Looking for competition? Join an existing league and test
            your skills against others. Enter a league code to get started
            and show off your HFL expertise.
          </p>
          <div className="chat-btn-container">
            <button className="chat-btn" onClick={navToLeagues}>
              <i className="fas fa-user-plus" /> Join a League
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="draft-trash-section">
        <div className="draft-container">
          <h2 className="not-heading">Global Chat</h2>
          <p className="draft-description">
            Stay updated on the latest trash talk, heated debates, and trending discussions
            happening across all HFL leagues. Don’t miss out on the biggest call-outs!
          </p>
          <div className="draft-btn-container">
            <button className="not-btn" onClick={navToTrashTalk}>
              <i className="fas fa-bell" /> View Global Chat
            </button>
          </div>
        </div>

        <div className="divider2" />

        <div className="chat-container">
          <h2 className="not-heading">League Chat</h2>
          <p className="chat-description">
            Get real-time updates from your private league chat. See what your competitors
            are saying, engage in the latest debates, and keep the banter going strong!
          </p>
          <div className="chat-btn-container">
            <button className="not-btn" onClick={navToTrashTalk}>
              <i className="fas fa-bell" /> View League Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
