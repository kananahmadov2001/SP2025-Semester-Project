import React, { useState, useEffect } from "react";
import "./DraftPlayerPage.css";
import { useNavigate } from "react-router-dom";

function DraftPlayerPage() {
  const availablePlayers = [
    { id: 1, name: "LeBron James", team: "Lakers", position: "SF" },
    { id: 2, name: "Kevin Durant", team: "Suns", position: "PF" },
    { id: 3, name: "James Harden", team: "Clippers", position: "SG" },
    { id: 4, name: "Russell Westbrook", team: "Clippers", position: "PG" },
    { id: 5, name: "Draymond Green", team: "Warriors", position: "PF" },
  ];

  const [draftedPlayers, setDraftedPlayers] = useState([]);

  const draftPlayer = (player) => {
    if (!draftedPlayers.find((p) => p.id === player.id)) {
      setDraftedPlayers([...draftedPlayers, player]);
    }
  };

  const removePlayer = (id) => {
    setDraftedPlayers(draftedPlayers.filter((player) => player.id !== id));
  };

  return (
    <div className="draft-page">
      <h1>Draft Your Flop Squad</h1>
      <p>Select the players you believe will perform the worst this week!</p>

      {/* Available Players */}
      <div className="players-container">
        <h2>Available Players</h2>
        <ul className="player-list">
          {availablePlayers.map((player) => (
            <li key={player.id} className="player-item">
              <span>{player.name} ({player.team}) - {player.position}</span>
              <button onClick={() => draftPlayer(player)} className="draft-btn">Draft</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Drafted Players */}
      <div className="drafted-players">
        <h2>Your Flop Squad</h2>
        {draftedPlayers.length === 0 ? (
          <p>No players drafted yet.</p>
        ) : (
          <ul className="player-list">
            {draftedPlayers.map((player) => (
              <li key={player.id} className="player-item drafted">
                <span>{player.name} ({player.team}) - {player.position}</span>
                <button onClick={() => removePlayer(player.id)} className="remove-btn">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DraftPlayerPage;