// react-frontend/src/HomePage.jsx

import React, { useState } from "react";
import './HomePage.css';
import TeamLogosRoller from "./TeamLogosRoller";
import BasketballField from './BasketballField';
import AddsFAQs from './AddsFAQs';

// Import our new components
import LoginForm from "./components/auth/LoginForm";
import RegisterModal from "./components/auth/RegisterModal";
import { UseAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  // State to show/hide the register modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user } = UseAuth();
  const navigate = useNavigate();

  // Handler to open modal
  function handleOpenRegisterModal() {
    setShowRegisterModal(true);
  }

  // Handler to close modal
  function handleCloseRegisterModal() {
    setShowRegisterModal(false);
  }

  // For navigation to team view or trash talk, same as your dashboard
  function navToTeamView() {
    navigate("/dashboard/teamView");
  }
  function navToTrashTalk() {
    navigate("/dashboard/trashTalk");
  }

  return (
    <div className="homepage-container">
      {!user ? (
        /* ========================== NOT LOGGED IN SECTION ========================== */
        <div className="nav-container">
          <div className="main-section">
            {/* Left Portion */}
            <div className="left-section">
              <h1 className="main-title">PLAY HATER FANTASY</h1>
              <p className="description">
                Create your account or sign in with your HFL ID to play the new NBA Hater Fantasy game.
                Create a league and invite your friends to see who will win.
              </p>
              {/* Button to open the Register Modal */}
              <button
                className="create-account-btn"
                onClick={handleOpenRegisterModal}
              >
                Create your account
              </button>
            </div>

            {/* Right Portion (Login Form) */}
            <div className="right-section">
              <h2 className="login-header">Login</h2>
              <LoginForm />
              <div className="forgot-password">
                <a href="/forgot-password">Forgot your password?</a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================ LOGGED IN SECTION ============================ */
        <section className="draft-trash-section">
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

          {/* Trash Talk Zone */}
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
      )}

      {/* Team Logos Section */}
      <section className="team-logos">
        <TeamLogosRoller />
      </section>

      {/* Game Rules Section */}
      <section className="game-rules-section">
        {/* Top Image Banner */}
        <div className="game-rules-banner">
          <img src="/src/assets/nba-clutch.jpg" alt="Game Rules" />
        </div>

        {/* Bottom Text Sections */}
        <div className="game-rules-content">
          <div className="game-rule-item">
            <h3>BUILD YOUR ROSTER</h3>
            <p>Pick your 10 player NBA roster using your $100m budget.</p>
          </div>

          <div className="game-rule-item">
            <h3>CREATE LEAGUES</h3>
            <p>Create leagues and invite your friends to compete throughout the season.</p>
          </div>

          <div className="game-rule-item">
            <h3>SET YOUR LINE-UP</h3>
            <p>Choose your line-up for the next gameday and watch your starting 5 score points as they take to the court.</p>
          </div>

          <div className="game-rule-item">
            <h3>DRAFT AND DROP PLAYERS</h3>
            <p>Sign and waive players through the season to improve your team.</p>
          </div>
        </div>
      </section>

      {/* Visual Field Section */}
      <section className="visual-field-section">
        <BasketballField />
      </section>

      {/* Ads/FAQs Section */}
      <section className="ads-faqs-section">
        <AddsFAQs />
      </section>



      {/* Conditionally render the register modal */}
      {showRegisterModal && (
        <RegisterModal onClose={handleCloseRegisterModal} />
      )}
    </div>
  );
}

export default HomePage;
