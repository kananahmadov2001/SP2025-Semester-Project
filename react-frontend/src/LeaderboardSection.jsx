// react-frontend/src/LeaderboardSection.jsx
import React, { useState, useEffect } from "react";
import PlayerModal from "./components/PlayerModal";
import { PLAYERS_URL } from "./config/constants";

function LeaderboardSection({ onAddPlayer }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // 1) Fetch all players from /api/players
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(PLAYERS_URL, {
          credentials: "include", // if needed
        });
        const data = await response.json();
        if (response.ok && data.players) {
          setPlayers(data.players);
        } else {
          console.error("Error fetching players:", data.error);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }
    fetchPlayers();
  }, []);

  // 2) Called by the modal when "Add" is clicked
  function handleAdd(player) {
    onAddPlayer(player);    // calls parent function
    setSelectedPlayer(null); // close the modal
  }

  return (
    <section className="dashboard-section leaderboard-section">
      <h2 className="leaderboard-heading">Available Players</h2>

      <div className="table-container">
        <table className="player-stats-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Position</th>
              <th>Team</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.name} {player.lastname}</td>
                <td>{player.position}</td>
                <td>{player.team}</td>
                <td>
                  <button onClick={() => setSelectedPlayer(player)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing a single player's details */}
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onAdd={handleAdd}
        />
      )}
    </section>
  );
}

export default LeaderboardSection;
