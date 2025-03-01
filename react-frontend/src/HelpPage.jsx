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
                    <li>Rewards may be given to top finishers at the end of the season.</li>
                  </ul>

                  <strong>🔒 Private Leagues</strong>
                  <ul>
                    <li>Create your own leagues and set custom rules.</li>
                    <li>Invite your friends with a unique league code.</li>
                    <li>Compete only against the members in your private league.</li>
                    <li>League admins can manage rosters and set custom prizes.</li>
                  </ul>

                  <strong>🏀 How to Join & Create a League</strong>
                  <ul>
                    <li>You are automatically enrolled in the Global League.</li>
                    <li>To create a Private League, click <strong>"Create a League"</strong> and share the invite code.</li>
                    <li>To join a Private League, enter the league code in the <strong>"Join a League"</strong> section.</li>
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
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>For each missed field goal</td><td>+1</td></tr>
                      <tr><td>For each turnover</td><td>+2</td></tr>
                      <tr><td>For each missed free throw</td><td>+1</td></tr>
                      <tr><td>For each personal foul</td><td>+1</td></tr>
                      <tr><td>For getting benched mid-game</td><td>+3</td></tr>
                      <tr><td>For technical fouls</td><td>+3</td></tr>
                      <tr><td>For flagrant fouls</td><td>+5</td></tr>
                      <tr><td>For getting ejected</td><td>+10</td></tr>
                      <tr><td>For scoring over 25 points</td><td>-5</td></tr>
                      <tr><td>For recording a triple-double</td><td>-10</td></tr>
                    </tbody>
                  </table>

                  <p><strong>🔥 Bonus Points:</strong></p>
                  <ul>
                    <li>🏀 Airball Bonus: +2 points for each recorded airball.</li>
                    <li>🚀 Shaqtin' a Fool Moment: +5 points for an embarrassing play.</li>
                  </ul>

                  <p><em>Note: Scores are final once a game ends. No changes will be made after review.</em></p>
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
