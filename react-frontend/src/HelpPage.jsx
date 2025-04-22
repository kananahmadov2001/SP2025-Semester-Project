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
                    <li>5 Starters</li>
                    <li>5 Bench Players</li>
                  </ul>
                  Starters are the players you select to score points for your team each week. Bench players are your backup players who can be substituted in if your starters don’t play.
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
                  <p>All your points for the Gameday will be scored by these 5 players.</p>
                </div>
              )}
            </div>

            {/* Leagues */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("leagues")}>
                {openSections["leagues"] ? "▼" : "▶"} Leagues
              </button>
              {openSections["leagues"] && (
                <div className="faq-answer">
                  <p>Compete in two types of leagues: the <strong>Global League</strong>, where all users are automatically placed, and <strong>Private Leagues</strong>, which you can create and customize.</p>

                  <strong>🌍 Global League</strong>
                  <ul>
                    <li>All users are automatically placed in this league upon signing up.</li>
                    <li>The leaderboard updates weekly, ranking users based on total flop points.</li>
                    <li>Compete against everyone to be crowned the <strong>Ultimate HFL Champion</strong>.</li>
                  </ul>

                  <strong>🔒 Private Leagues</strong>
                  <ul>
                    <li>Create your own leagues!</li>
                    <li>Invite your friends</li>
                    <li>Compete only against the members in your private league</li>
                  </ul>

                  <strong>🏀 How to Join & Create a League</strong>
                  <ul>
                    <li>You are automatically enrolled in the Global League.</li>
                    <li>To create a Private League, click <strong>"Create a League"</strong></li>
                    <li>To join a Private League, find the league and press the <strong>"Join League"</strong> button.</li>
                  </ul>

                  <p><em>Want to challenge your friends? Set up your Private League now and start the trash talk!</em></p>
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
                  <p>Fantasy points are awarded based on real NBA performances. The lower your team scores, the better!</p>

                  <table className="scoring-table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Impact on Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Turnover</td><td>+1.5 pts each</td></tr>
                      <tr><td>Personal foul</td><td>+1.0 pt each</td></tr>
                      <tr><td>Missed field goal</td><td>+3.0 × miss rate</td></tr>
                      <tr><td>Missed free throw</td><td>+2.0 × miss rate</td></tr>
                      <tr><td>Missed 3-point shot</td><td>+2.5 × miss rate</td></tr>
                      <tr><td>Blocks (defensive)</td><td>−2.5 pts each</td></tr>
                      <tr><td>Steals</td><td>−2.0 pts each</td></tr>
                      <tr><td>Plus/Minus</td><td>−1 pt per +10</td></tr>
                    </tbody>
                  </table>

                  <p><strong>🔥 Bonus Modifiers:</strong></p>
                  <ul>
                    <li>🎯 Minutes Normalizer: Scores scale to a 36-minute pace</li>
                    <li>📉 Low playing time = higher multiplier impact</li>
                  </ul>

                  <p><em>Note: All values are calculated automatically based on performance stats. Final fantasy scores are normalized for equal comparison.</em></p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="faq-section">
            <h2>Terms & Conditions</h2>
            <p>
              <strong>Eligibility:</strong> Hater Fantasy League (HFL) is open to individuals who are at least 18 years old (or the age of majority in your country).
              By participating, you confirm that you meet these requirements.
            </p>
            <p>
              <strong>Game Rules & Conduct:</strong> Players must adhere to all HFL rules and scoring systems.
              Any attempt to manipulate game results, engage in unfair play, or abuse the system will result in immediate disqualification.
            </p>
            <p>
              <strong>Privacy & Data Usage:</strong> HFL respects your privacy. We collect and store necessary user data for account management and game functionality.
              Your information will not be sold to third parties.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> HFL is provided “as-is” without any guarantees. We are not responsible for any losses, including but not limited to
              game performance, system downtime, or miscalculations.
            </p>
            <p>
              <strong>Modifications to Terms:</strong> HFL reserves the right to update or modify these terms at any time. Continued participation in the game
              constitutes acceptance of any updates.
            </p>
          </div>
        )}

        {activeTab === "help" && (
          <div className="faq-section">
            {/* Frequently Asked Questions */}
            <h2>Frequently Asked Questions (FAQs)</h2>
            {/* General Questions */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("general")}>
                {openSections["general"] ? "▼" : "▶"} General Questions
              </button>
              {openSections["general"] && (
                <div className="faq-answer visible">
                  <strong>What is Hater Fantasy League?</strong>
                  <p>HFL is a fantasy game where you earn points for predicting the worst-performing NBA players.</p>

                  <strong>How do I play?</strong>
                  <p>Draft a team of flops, set your lineup, and compete for the lowest scores each week.</p>

                  <strong>How do I win?</strong>
                  <p>The player with the most flop points at the end of the season wins.</p>

                  <strong>When does the season start?</strong>
                  <p>HFL runs parallel to the NBA season. You can join at any time.</p>
                </div>
              )}
            </div>
            {/* Account Issues */}
            <div className="faq-item">
              <button className="faq-question" onClick={() => toggleSection("account")}>
                {openSections["account"] ? "▼" : "▶"} Account Issues
              </button>
              {openSections["account"] && (
                <div className="faq-answer visible">
                  <strong>I forgot my password. What should I do?</strong>
                  <p>Click "Forgot Password" on the login page and follow the instructions to reset your password.</p>

                  <strong>My account was suspended. Why?</strong>
                  <p>Accounts may be suspended for violating the community guidelines or using multiple accounts unfairly.</p>

                  <strong>How do I contact support?</strong>
                  <p>You can reach out to our support team via one of the following emails <strong>a.kanan@wustl.edu, a.sow@wustl.edu, a.feenstra@wustl.edu,	or r.weikai@wustl.edu</strong>.</p>
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
