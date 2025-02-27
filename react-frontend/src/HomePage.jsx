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



      {/* Conditionally render the register modal */}
      {showRegisterModal && (
        <RegisterModal onClose={handleCloseRegisterModal} />
      )}
    </div>
  );
}

export default HomePage;
