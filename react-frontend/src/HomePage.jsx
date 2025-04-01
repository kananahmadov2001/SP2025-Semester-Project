// react-frontend/src/HomePage.jsx

import React, { useState } from "react";
import './HomePage.css';
import TeamLogosRoller from "./TeamLogosRoller";
import AddsFAQs from './AddsFAQs';

// Import our new components
import LoginForm from "./components/auth/LoginForm";
import RegisterModal from "./components/auth/RegisterModal";
import { UseAuth } from "./context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

function HomePage() {
  // State to show/hide the register modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user } = UseAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect them to the Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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
        <div className="game-rules-banner">
          <img src="/src/assets/nba-clutch.jpg" alt="Game Rules" />
        </div>

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


      {/* Unique Features Section */}
      <section className="unique-features-section">
        {/* Section Title */}
        <h1 className="features-title">What makes HFL Unique?</h1>
        {/* Image & Feature Container */}
        <div className="features-container">
          {/* Left: Image */}
          <div className="features-image">
            <img src="/src/assets/kyrie.webp" alt="Unique Features" />
          </div>
          {/* Right: Feature List */}
          <div className="features-list">
            <div className="feature-item">
              <h3>Draft The Worst</h3>
              <p>Pick the players most likely to underperform and win by being the best at being the worst.</p>
            </div>
            <div className="feature-item">
              <h3>Trash Talk Zone</h3>
              <p>Engage with your friends, drop hot takes, and roast the worst performances.</p>
            </div>
            <div className="feature-item">
              <h3>Weekly Challenges</h3>
              <p>Compete in special themed challenges for exclusive bragging rights.</p>
            </div>
            <div className="feature-item">
              <h3>Real-Time Team View</h3>
              <p>Track your squad's failure stats live and see how you compare.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Ads/FAQs Section */}
      <section className="ads-faqs-section">
        <AddsFAQs />
      </section>

      <section className="back-to-login-section">
        <div className="back-to-login-container">
          <p className="back-to-login-text">Back to Login or Register</p>
          <button className="back-to-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <i className="fas fa-chevron-up"></i>
          </button>
        </div>
      </section>


      {/* Conditionally render the register modal */}
      {showRegisterModal && (
        <RegisterModal onClose={handleCloseRegisterModal} />
      )}
    </div>
  );
}

export default HomePage;
