// react-frontend/src/HomePage.jsx

import React, { useState } from "react";
import './HomePage.css';
import TeamLogosRoller from "./TeamLogosRoller";
import BasketballField from './BasketballField';
import AddsFAQs from './AddsFAQs';

// Import our new components
import LoginForm from "./components/auth/LoginForm";
import RegisterModal from "./components/auth/RegisterModal";

function HomePage() {
  // State to show/hide the register modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Handler to open modal
  function handleOpenRegisterModal() {
    setShowRegisterModal(true);
  }

  // Handler to close modal
  function handleCloseRegisterModal() {
    setShowRegisterModal(false);
  }

  return (
    <div className="homepage-container">
      {/* Header Section */}
      <header className="header-section">
        {/* Left Side: Empty Space to Balance Layout */}
        <div></div>

        {/* Right Side: HFL Logo + NBA Logo */}
        <div className="hfl-logo-container">
          {/* HFL Logo */}
          <div className="hfl-logo">
            HFL
            <span>Hater Fantasy League</span>
            <div className="hfl-border"></div>
          </div>
          {/* NBA Logo */}
          <img src="/src/assets/nba-logo.png" alt="NBA Logo" className="nba-logo" />
        </div>
      </header>



      {/* Navigation Section */}
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

      {/* Team Logos Section */}
      <section className="team-logos">
        <TeamLogosRoller />
      </section>

      {/* Visual Field Section */}
      <section className="visual-field-section">
        <BasketballField />
      </section>

      {/* Ads/FAQs Section */}
      <section className="ads-faqs-section">
        <AddsFAQs />
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
          &copy; 2025 Hater Fantasy League. All rights reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms</a> | <a href="#">Site Map</a>
        </p>
      </footer>

      {/* Conditionally render the register modal */}
      {showRegisterModal && (
        <RegisterModal onClose={handleCloseRegisterModal} />
      )}
    </div>
  );
}

export default HomePage;
