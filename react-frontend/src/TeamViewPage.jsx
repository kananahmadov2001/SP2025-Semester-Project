// react-frontend/src/TeamViewPage.jsx
import React, { useState, useEffect } from "react";
import "./TeamViewPage.css";
import PlayerModal from "./components/PlayerModal";
import SquadSelection from "./components/SquadSelection";
import {
  FANTASY_TEAM_URL,
  FANTASY_ADD_URL,
  PLAYERS_URL,
  FANTASY_REMOVE_URL,
} from "./config/constants";

function DraftPlayerPage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [userTeam, setUserTeam] = useState([]);

  // Fetch the user's name & ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedUserId) setUserId(storedUserId);
    if (storedName) setUserName(storedName);
  }, []);

  // On mount (and whenever userId changes), load the user's team
  useEffect(() => {
    if (userId) {
      fetchUserTeam(userId);
    }
  }, [userId]);

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

  // Fetch the user's current fantasy team from backend
  async function fetchUserTeam(userIdParam) {
    try {
      const response = await fetch(`${FANTASY_TEAM_URL}?userId=${userIdParam}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.fantasyTeam) {
        setUserTeam(data.fantasyTeam);
      } else {
        console.error("Error fetching user team:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user team:", error);
    }
  }

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

  // 2) Called by the modal when "Add" is clicked
  function handleAdd(player) {
    handleAddPlayer(player);    // calls parent function
    setSelectedPlayer(null); // close the modal
  }

  // Add player with EXACT 5-SLOT ENFORCEMENT
  async function handleAddPlayer(player) {
    if (!userId) {
      alert("You must be logged in to add players.");
      return;
    }

    // Step A: Determine if this is front-court or back-court (TODO: this needs modification once the actual player data is determined)
    const isFrontCourt = player.position.includes("F") || player.position.includes("C");
    const isBackCourt = player.position.includes("G");

    // Step B: Count how many FC or BC players are already on the team
    const fcCount = userTeam.filter(
      (p) => p.position.includes("F") || p.position.includes("C")
    ).length;
    const bcCount = userTeam.filter((p) => p.position.includes("G")).length;

    if (isFrontCourt && fcCount >= 5) {
      alert("You already have 5 front-court players! Remove one before adding another.");
      return;
    }
    if (isBackCourt && bcCount >= 5) {
      alert("You already have 5 back-court players! Remove one before adding another.");
      return;
    }

    // Step C: Make the API call to add the player
    try {
      const response = await fetch(FANTASY_ADD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: Number(userId), playerId: player.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add player");
      }

      alert(`Added playerId(${data.playerId}) to your team!`);
      // Re-fetch updated team
      await fetchUserTeam(userId);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Remove player from the user’s team
  async function handleRemovePlayer(playerId) {
    if (!userId) {
      alert("You must be logged in to remove players.");
      return;
    }

    try {
      const response = await fetch(FANTASY_REMOVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: Number(userId), playerId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove player");
      }

      alert("Player removed from your team!");
      // Re-fetch updated team
      await fetchUserTeam(userId);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="draftPlayer-container">

      {/* DraftPlayer Header */}

      {/* EDIT HERE FOR THE HEADER SIMILAR TO DashboardPage.jsx */}



      {/* Create/View Squad Section */}
      <section className="squad-section">
        <h2>Create/View Squad</h2>
        {/*
          Pass the entire userTeam array to SquadSelection,
          along with the remove handler.
        */}
        <SquadSelection userTeam={userTeam} onRemovePlayer={handleRemovePlayer} />
      </section>

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
                <button className="draft-btn" onClick={() => setSelectedPlayer(player)}>Draft Player</button>
              </div>
            ))
          )}
        </div>



        {/* Modal for viewing a single player's details */}
        {selectedPlayer && (
          <PlayerModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            onAdd={handleAdd}
          />
        )}
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
