// react-frontend/src/components/PlayerModal.jsx
import React, { useState, useEffect } from "react";
import "./PlayerModal.css";
import { PLAYER_SCORE_URL } from "../config/constants";

/**
 * @param {object} player - the player object with {id, firstname, lastname, position, team, etc.}
 * @param {function} onClose - closes the modal
 * @param {function} [onAdd] - optional add function. If omitted or hideAddButton === true, we hide the "Add to Team" button
 * @param {boolean} [hideAddButton=false] - if true, never show the add button
 */
function PlayerModal({ player, onClose, onAdd, hideAddButton = false }) {
    const [scoresData, setScoresData] = useState(null);
    const [isLoadingScores, setIsLoadingScores] = useState(false);
    const [error, setError] = useState("");

    if (!player) return null;

    // 1) On mount or player change, fetch the advanced stats
    useEffect(() => {
        async function fetchPlayerScores() {
            setIsLoadingScores(true);
            setError("");
            try {
                const resp = await fetch(`${PLAYER_SCORE_URL}?playerId=${player.id}`);
                const data = await resp.json();
                console.log(`playerId(${player.id}):`, data);
                if (!resp.ok) {
                    throw new Error(data.error || "Failed to load player scores");
                }
                // data = { scores: [...] }
                setScoresData(data.scores || []);
            } catch (err) {
                console.error("Error fetching player scores:", err);
                setError(err.message || "Could not load player scores");
                setScoresData(null);
            } finally {
                setIsLoadingScores(false);
            }
        }

        fetchPlayerScores();
    }, [player.id]);

    // 2) Render the modal
    return (
        <div className="player-modal-overlay">
            <div className="player-modal-content">
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                <h2>
                    {player.firstname} {player.lastname}
                </h2>

                {/* "Add to Team" button is shown only if onAdd is provided and hideAddButton is false */}
                {!hideAddButton && onAdd && (
                    <button className="add-button" onClick={() => onAdd(player)}>
                        Add to Team
                    </button>
                )}

                <div className="player-modal-stats">
                    <div className="stats-section">
                        <p>
                            <strong>Position:</strong> {player.position}
                        </p>
                        <p>
                            <strong>Team:</strong> {player.team}
                        </p>

                        <hr />
                        {/* If loading, show a spinner or text */}
                        {isLoadingScores && <p>Loading advanced stats...</p>}

                        {/* If there's an error */}
                        {error && <p className="error-text">Error: {error}</p>}

                        {/* If we have scores data, display it */}
                        {scoresData && scoresData.length > 0 && (
                            <div className="scores-table">
                                <h3>Latest Game Data:</h3>
                                {/* Example: show the first entry or all entries in a map */}
                                {scoresData.map((s, index) => (
                                    <div key={index} className="scores-entry">
                                        <p>
                                            <strong>Game Date:</strong>{" "}
                                            {new Date(s.game_date).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Weekly Score:</strong> {s.weekly_score}
                                        </p>
                                        <p>
                                            <strong>Cumulative Score:</strong> {s.cumulative_score}
                                        </p>
                                        <p>
                                            <strong>Turnovers:</strong> {s.turnovers}
                                        </p>
                                        <p>
                                            <strong>Personal Fouls:</strong> {s.personal_fouls}
                                        </p>
                                        <p>
                                            <strong>FG Attempted:</strong> {s.field_goals_attempted}
                                        </p>
                                        <p>
                                            <strong>FG Made:</strong> {s.field_goals_made}
                                        </p>
                                        <p>
                                            <strong>3P Attempted:</strong> {s.three_pointers_attempted}
                                        </p>
                                        <p>
                                            <strong>3P Made:</strong> {s.three_pointers_made}
                                        </p>
                                        <p>
                                            <strong>Blocks:</strong> {s.blocks}
                                        </p>
                                        <p>
                                            <strong>Steals:</strong> {s.steals}
                                        </p>
                                        <p>
                                            <strong>Plus/Minus:</strong> {s.plus_minus}
                                        </p>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* If no scores found (but no error) */}
                        {!isLoadingScores && !error && scoresData && scoresData.length === 0 && (
                            <p>No advanced stats found for this player.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerModal;
