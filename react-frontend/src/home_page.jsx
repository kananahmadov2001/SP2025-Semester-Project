import React from "react";
import './home_page.css';

function home_page() {
  return (
    <div className="homepage-container">
      {/* Header Section */}
      <header
        className="header-section"
      >
      </header>

      {/* Navigation Section */}
      <nav className="navigation-section">
        <div className="nav-buttons">
          <button>Dashboard</button>
          <button>Stats</button>
          <button>FAQs</button>
        </div>
        <div className="login-section">
          <button>Login</button>
          <button>Create Account</button>
        </div>
      </nav>

      {/* Visual Field Section */}
      <section className="visual-field">
        <h2>Visual Basketball/Soccer Field</h2>
        <div className="field-placeholder">Field Visualization Coming Soon!</div>
      </section>

      {/* Stats Dashboard Section */}
      <section className="stats-dashboard">
        <h2>Stats Dashboard</h2>
        <div className="stats-placeholder">Player and Team Stats Here</div>
      </section>

      {/* Ads/FAQs Section */}
      <section className="ads-faqs-section">
        <h2>Additional Information</h2>
        <p>Ads, FAQs, and other details will go here.</p>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <p>&copy; 2025 Hater Fantasy League. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default home_page;
