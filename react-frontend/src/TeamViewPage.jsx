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
import { getCourtType } from "./utils/utilityFunctions";
// 1) Import the Auth context
import { UseAuth } from "./context/AuthContext";

function DraftPlayerPage() {
  // 2) Get user from Auth context
  const { user } = UseAuth();

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [userTeam, setUserTeam] = useState([]);

  // 3) On mount, fetch the player's team if user is available
  useEffect(() => {
    if (user) {
      fetchUserTeam(user.userId);
    }
  }, [user]);

  // 4) Fetch players from the API once, on mount
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

  // 5) Helper to fetch user’s fantasy team from backend
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

  // 6) Handle search functionality
  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    // If user clears the input, revert to showing 10 random players
    if (!query) {
      setFilteredPlayers(players.slice(0, 10));
      return;
    }

    // Combine firstname & lastname, and check if either one (or both) match
    const results = players.filter((player) => {
      const fullName = `${player.firstname} ${player.lastname}`.toLowerCase();
      return fullName.includes(query);
    });

    setFilteredPlayers(results);
  };

  // 7) Handle adding a player to the user’s team
  async function handleAddPlayer(player) {
    // Defensive check: if somehow user is null (should never happen in protected route)
    if (!user) {
      alert("You must be logged in to add players.");
      return;
    }

    // Classify the position
    const courtType = getCourtType(player.position);
    const isFrontCourt = courtType === "front";
    const isBackCourt = courtType === "back";

    // Count how many FC or BC players are already on the team
    const fcCount = userTeam.filter(
      (p) => getCourtType(p.position) === "front"
    ).length;
    const bcCount = userTeam.filter(
      (p) => getCourtType(p.position) === "back"
    ).length;

    if (isFrontCourt && fcCount >= 5) {
      alert("You already have 5 front-court players! Remove one before adding another.");
      return;
    }
    if (isBackCourt && bcCount >= 5) {
      alert("You already have 5 back-court players! Remove one before adding another.");
      return;
    }

    // Make the API call to add the player
    try {
      const response = await fetch(FANTASY_ADD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: Number(user.userId),
          playerId: player.id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add player");
      }

      alert(`Added playerId(${data.playerId}) to your team!`);
      // Re-fetch updated team
      await fetchUserTeam(user.userId);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // 8) Called by the modal when "Add" is clicked
  function handleAdd(player) {
    handleAddPlayer(player);
    setSelectedPlayer(null); // close the modal
  }

  // 9) Remove player from the user’s team
  async function handleRemovePlayer(playerId) {
    if (!user) {
      alert("You must be logged in to remove players.");
      return;
    }

    try {
      const response = await fetch(FANTASY_REMOVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: Number(user.userId),
          playerId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove player");
      }

      alert("Player removed from your team!");
      // Re-fetch updated team
      await fetchUserTeam(user.userId);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // 10) If for some reason user is null (shouldn’t happen since route is protected),
  // we could return null or a loading spinner.
  if (!user) {
    return null;
  }

  return (
    <div className="draftPlayer-container">
      {/* Create/View Squad Section */}
      <section className="squad-section">
        <h2>Create/View Squad</h2>
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
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Player Cards */}
        <div className="draft-player-card-container">
          {filteredPlayers.length === 0 ? (
            <p className="no-results">No players found.</p>
          ) : (
            filteredPlayers.map((player) => (
              <div key={player.id} className="draft-player-card">
                <h3>
                  {player.firstname} {player.lastname}
                </h3>
                <p>
                  <strong>Team:</strong> {player.team}
                </p>
                <p>
                  <strong>Position:</strong> {player.position}
                </p>
                <button
                  className="draft-btn"
                  onClick={() => setSelectedPlayer(player)}
                >
                  Draft Player
                </button>
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
    </div>
  );
}

export default DraftPlayerPage;
