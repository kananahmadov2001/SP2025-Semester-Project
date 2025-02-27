// react-frontend/src/components/PlayerModal.jsx
import React from "react";
import "./PlayerModal.css"; // optional styling

function PlayerModal({ player, onClose, onAdd }) {
    if (!player) return null;

    return (
        <div className="player-modal-overlay">
            <div className="player-modal-content">
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                <h2>
                    {player.firstname} {player.lastname}
                </h2>
                <div className="player-modal-stats">
                    {/* The top area is the "Add" button */}
                    <button className="add-button" onClick={() => onAdd(player)}>
                        Add to Team
                    </button>

                    <div className="stats-section">
                        <p><strong>Position:</strong> {player.position}</p>
                        <p><strong>Team:</strong> {player.team}</p>
                        <p><strong>Jersey #:</strong> {player.jerseyno || "N/A"}</p>
                        <hr />
                        <p><strong>Sample Advanced Stats (Placeholder)</strong></p>
                        <ul>
                            <li>Points per Game: 25.3</li>
                            <li>Rebounds per Game: 8.1</li>
                            <li>Assists per Game: 6.5</li>
                            <li>Steals per Game: 1.8</li>
                            <li>Blocks per Game: 0.9</li>
                            <li>Turnovers per Game: 3.2</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerModal;
