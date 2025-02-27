// react-frontend/src/HelpPage.jsx

import React, { useState } from "react";
import "./HelpPage.css";

function HelpPage() {
  const [activeTab, setActiveTab] = useState("rules");
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="help-page">
      {/* Navigation Tabs */}
      <div className="help-tabs">
        <button
          className={`tab-button ${activeTab === "rules" ? "active" : ""}`}
          onClick={() => setActiveTab("rules")}
        >
          Rules
        </button>
        <button
          className={`tab-button ${activeTab === "terms" ? "active" : ""}`}
          onClick={() => setActiveTab("terms")}
        >
          T&C's
        </button>
        <button
          className={`tab-button ${activeTab === "help" ? "active" : ""}`}
          onClick={() => setActiveTab("help")}
        >
          FAQs
        </button>
        <button
          className={`tab-button ${activeTab === "updates" ? "active" : ""}`}
          onClick={() => setActiveTab("updates")}
        >
          Updates
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        
        {activeTab === "rules" && (
          <div className="faq-section">
            <h2>Fantasy Rules</h2>
            {/* Selecting Your Initial Roster */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("roster")}>
                {openSections["roster"] ? "▼" : "▶"} Selecting Your Initial Roster
              </button>
              {openSections["roster"] && (
                <div className="faq-answer">
                  <strong>Roster Size</strong>
                  <p>To join the game, select a fantasy basketball roster of 10 players, consisting of:</p>
                  <ul>
                    <li>5 Back Court players</li>
                    <li>5 Front Court players</li>
                  </ul>
                  <strong>Salary Cap</strong>
                  <p>The total value of your initial roster must not exceed the salary cap of $100 million.</p>
                  <strong>Players Per Team</strong>
                  <p>You can select up to 2 players from a single NBA team.</p>
                </div>
              )}
            </div>

            {/* Managing Your Team */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("managing")}>
                {openSections["managing"] ? "▼" : "▶"} Managing Your Team
              </button>
              {openSections["managing"] && (
                <div className="faq-answer">
                  <strong>Choosing Your Line-up</strong>
                  <p>From your 10-player roster, select 5 players by the Gameday deadline to form your starting line-up.</p>
                  <p>All your points for the Gameday will be scored by these 5 players. If one or more don’t play, they may be automatically substituted.</p>
                  <p>Your team can play in one of two formations:</p>
                  <ul>
                    <li>2 Back Court and 3 Front Court</li>
                    <li>3 Back Court and 2 Front Court</li>
                  </ul>
                  <strong>Prioritizing Your Bench for Automatic Substitutions</strong>
                  <p>
                    Your bench provides cover for unforeseen events like injuries and postponements by automatically replacing starting players who don’t play.
                  </p>
                  <p>
                    If any of your players don’t play, they will be substituted by the highest priority bench player who played and doesn’t break the formation rules.
                  </p>
                </div>
              )}
            </div>

            {/* Leagues */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("transactions")}>
                {openSections["transactions"] ? "▼" : "▶"} Leagues
              </button>
              {openSections["transactions"] && (
                <div className="faq-answer">
                  <p> </p>
                </div>
              )}
            </div>

            {/* Scoring */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("scoring")}>
                {openSections["scoring"] ? "▼" : "▶"} Scoring
              </button>
              {openSections["scoring"] && (
                <div className="faq-answer">
                  <p>During the season, your NBA fantasy players will be allocated points based on their performance.</p>
                  <table className="scoring-table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>For each point scored</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>For each rebound</td>
                        <td>1.2</td>
                      </tr>
                      <tr>
                        <td>For each assist</td>
                        <td>1.5</td>
                      </tr>
                      <tr>
                        <td>For each block</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>For each steal</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>For each turnover</td>
                        <td>-1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="faq-section">
            <h2>Terms & Conditions</h2>
            <p>All the terms & conditions of the game are displayed here.</p>
          </div>
        )}

        {activeTab === "help" && (
          <div className="faq-section">
            {/* Frequently Asked Questions */}
            <h2>Frequently Asked Questions (FAQs)</h2>
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("general")}> 
                {openSections["general"] ? "▼" : "▶"} General Questions
              </button>
              {openSections["general"] && (
                <div className="faq-answer visible">
                  <p>Here are answers to some common questions.</p>
                </div>
              )}
            </div>

            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("account")}> 
                {openSections["account"] ? "▼" : "▶"} Account Issues
              </button>
              {openSections["account"] && (
                <div className="faq-answer visible">
                  <p>Having trouble with your account? Here’s what you can do.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "updates" && (
          <div className="faq-section">
            <h2>Latest Updates</h2>
            <p>Check out the latest game updates and announcements.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpPage;
