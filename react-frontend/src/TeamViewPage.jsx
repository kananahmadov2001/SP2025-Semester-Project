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
import { UseAuth } from "./context/AuthContext";

function DraftPlayerPage() {
  const { user } = UseAuth();

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [userTeam, setUserTeam] = useState([]);

  // Loading states
  const [isFetchingPlayers, setIsFetchingPlayers] = useState(false);
  const [isFetchingTeam, setIsFetchingTeam] = useState(false);

  // On mount (and whenever user changes), load the user's team if we have a user
  useEffect(() => {
    if (user) {
      fetchUserTeam(user.userId);
    }
  }, [user]);

  // Fetch players from the API once, on mount
  useEffect(() => {
    async function fetchPlayers() {
      try {
        setIsFetchingPlayers(true); // start loading
        const response = await fetch(PLAYERS_URL, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.players) {
          // Shuffle and select 10 random players initially
          const shuffledPlayers = data.players.sort(() => 0.5 - Math.random());
          setPlayers(shuffledPlayers);
          setFilteredPlayers(shuffledPlayers.slice(0, 10));
        } else {
          console.error("Error fetching players:", data.error);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setIsFetchingPlayers(false); // end loading
      }
    }
    fetchPlayers();
  }, []);

  // Helper to fetch the user's current fantasy team
  async function fetchUserTeam(userIdParam) {
    try {
      setIsFetchingTeam(true); // start loading
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
    } finally {
      setIsFetchingTeam(false); // end loading
    }
  }

  // Handle search functionality
  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      // If user clears the input, revert to showing 10 random players
      setFilteredPlayers(players.slice(0, 10));
      return;
    }

    // Combine firstname & lastname and check if they match
    const results = players.filter((player) => {
      const fullName = `${player.firstname} ${player.lastname}`.toLowerCase();
      return fullName.includes(query);
    });
    setFilteredPlayers(results);
  };

  // Add player to the user's team
  async function handleAddPlayer(player) {
    if (!user) {
      alert("You must be logged in to add players.");
      return;
    }

    // Classify position
    const courtType = getCourtType(player.position);
    const isFrontCourt = courtType === "front";
    const isBackCourt = courtType === "back";

    // Count how many FC / BC players are on the team
    const fcCount = userTeam.filter(
      (p) => getCourtType(p.position) === "front"
    ).length;
    const bcCount = userTeam.filter(
      (p) => getCourtType(p.position) === "back"
    ).length;

    if (isFrontCourt && fcCount >= 5) {
      alert("You already have 5 front-court players! Remove one first.");
      return;
    }
    if (isBackCourt && bcCount >= 5) {
      alert("You already have 5 back-court players! Remove one first.");
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
      await fetchUserTeam(user.userId); // reload the team
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Called by the modal's "Add" button
  function handleAdd(player) {
    handleAddPlayer(player);
    setSelectedPlayer(null); // close the modal
  }

  // Remove player from user's team
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
      await fetchUserTeam(user.userId); // reload the team
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // If user is null (shouldn't happen in protected route), or if still loading
  if (!user) {
    return null;
  }

  // If we are still fetching players or the userTeam, show a loading message/spinner
  if (isFetchingPlayers || isFetchingTeam) {
    return (
      <div className="draftPlayer-container">
        <h2>Loading data, please wait...</h2>
        {/* Replace with a fancy spinner component if you want */}
      </div>
    );
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
                <p><strong>Team:</strong> {player.team}</p>
                <p><strong>Position:</strong> {player.position}</p>
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
