import React, { useState, useEffect } from "react";
import "./DraftPlayerPage.css";
import { PLAYERS_URL } from "./config/constants";

function DraftPlayerPage() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch players from API
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(PLAYERS_URL, {
          credentials: "include", // include cookies if needed
        });
        const data = await response.json();
        if (response.ok && data.players) {
          // shuffle and select 10 random players initially
          const shuffledPlayers = data.players.sort(() => 0.5 - Math.random());
          setPlayers(shuffledPlayers);
          setFilteredPlayers(shuffledPlayers.slice(0, 10)); // display 10 players
        } else {
          console.error("Error fetching players:", data.error);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }
    fetchPlayers();
  }, []);

  // Handle Search Functionality
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredPlayers(players.slice(0, 10)); // reset to 10 random players
      return;
    }

    const results = players.filter((player) =>
      `${player.name} ${player.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlayers(results);
  };

  return (
    <div className="draftPlayer-container">
      
      {/* DraftPlayer Header */}
      
      {/* EDIT HERE FOR THE HEADER SIMILAR TO DashboardPage.jsx */}

      {/* Draft Page Section */}
      <div className="draft-page">
        <h1>Draft Your Flop Squad</h1>
        <p>Search for players or pick from the worst-performing stars of the week!</p>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search player name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>

        {/* Player Cards */}
        <div className="draft-player-card-container">
          {filteredPlayers.length === 0 ? (
            <p className="no-results">No players found.</p>
          ) : (
            filteredPlayers.map((player) => (
              <div key={player.id} className="draft-player-card">
                <h3>{player.name} {player.lastname}</h3>
                <p><strong>Team:</strong> {player.team}</p>
                <p><strong>Position:</strong> {player.position}</p>
                <button className="draft-btn">Draft Player</button>
              </div>
            ))
          )}
        </div>
      </div>

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

export default DraftPlayerPage;
