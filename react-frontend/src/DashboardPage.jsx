// react-frontend/src/DashboardPage.jsx

import React from "react";
import "./DashboardPage.css";
import LeaderboardSection from "./LeaderboardSection";

function DashboardPage() {
  return (
    <div className="dashboard-container">

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <h1>Your Dashboard</h1>
        <button className="signout-btn">Sign Out</button>
      </header>

      {/* Create/View Squad Section */}
      <section className="dashboard-section squad-section">
        <h2>Create/View Squad</h2>
      </section>

      {/* Leaderboards & Fixtures Section */}
      <section className="leaderboard-section">
        <LeaderboardSection />
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
