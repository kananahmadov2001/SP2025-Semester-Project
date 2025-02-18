// react-frontend/src/components/SquadSelection.jsx
import React, { useState } from "react";
import "./SquadSelection.css";

function SquadSelection({ userTeam, onRemovePlayer }) {
    const [viewType, setViewType] = useState("court");

    // Partition the user team into front/back
    const frontCourtPlayers = userTeam.filter(
        (p) => p.position.includes("F") || p.position.includes("C")  // TODO: Modify it according to actual player data in the future!
    );
    const backCourtPlayers = userTeam.filter((p) => p.position.includes("G"));

    // We expect a maximum of 5 in each.
    const fcSlots = Array.from({ length: 5 }, (_, idx) => frontCourtPlayers[idx] || null);
    const bcSlots = Array.from({ length: 5 }, (_, idx) => backCourtPlayers[idx] || null);

    const selectedPlayersCount = userTeam.length;
    const [moneyRemaining, setMoneyRemaining] = useState(100.0); // or compute dynamically

    return (
        <div className="squad-selection-container">
            {/* Header section: Players Selected & Money Remaining */}
            <div className="squad-header">
                <span className="players-selected">
                    Players Selected: {selectedPlayersCount} / 10
                </span>
                <span className="money-remaining">
                    Money Remaining: {moneyRemaining.toFixed(1)}
                </span>
            </div>

            {/* View Toggle Buttons */}
            <div className="view-toggle-container">
                <button
                    className={`toggle-btn ${viewType === "court" ? "active" : ""}`}
                    onClick={() => setViewType("court")}
                >
                    Court View
                </button>
                <button
                    className={`toggle-btn ${viewType === "list" ? "active" : ""}`}
                    onClick={() => setViewType("list")}
                >
                    List View
                </button>
            </div>

            {viewType === "court" ? (
                // COURT VIEW -> 3 + 2 layout for each group
                <div className="court-view">
                    {/* FRONT COURT */}
                    <div className="front-court">
                        <h3>Front Court</h3>
                        <div className="fc-row">
                            {fcSlots.slice(0, 3).map((player, index) => (
                                <div key={index} className="fc-slot">
                                    {player ? (
                                        <>
                                            <div className="player-name">
                                                {player.firstname} {player.lastname}
                                            </div>
                                            <div className="player-position">
                                                Position: {player.position}
                                            </div>
                                            <div className="player-team">
                                                Team: {player.team}
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => onRemovePlayer(player.id)}
                                            >
                                                Remove
                                            </button>
                                        </>
                                    ) : (
                                        <div className="empty-slot">Empty FC Slot</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="fc-row">
                            {fcSlots.slice(3, 5).map((player, index) => (
                                <div key={index + 3} className="fc-slot">
                                    {player ? (
                                        <>
                                            <div className="player-name">
                                                {player.firstname} {player.lastname}
                                            </div>
                                            <div className="player-position">
                                                Position: {player.position}
                                            </div>
                                            <div className="player-team">
                                                Team: {player.team}
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => onRemovePlayer(player.id)}
                                            >
                                                Remove
                                            </button>
                                        </>
                                    ) : (
                                        <div className="empty-slot">Empty FC Slot</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BACK COURT */}
                    <div className="back-court">
                        <h3>Back Court</h3>
                        <div className="bc-row">
                            {bcSlots.slice(0, 3).map((player, index) => (
                                <div key={index} className="bc-slot">
                                    {player ? (
                                        <>
                                            <div className="player-name">
                                                {player.firstname} {player.lastname}
                                            </div>
                                            <div className="player-position">
                                                Position: {player.position}
                                            </div>
                                            <div className="player-team">
                                                Team: {player.team}
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => onRemovePlayer(player.id)}
                                            >
                                                Remove
                                            </button>
                                        </>
                                    ) : (
                                        <div className="empty-slot">Empty BC Slot</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="bc-row">
                            {bcSlots.slice(3, 5).map((player, index) => (
                                <div key={index + 3} className="bc-slot">
                                    {player ? (
                                        <>
                                            <div className="player-name">
                                                {player.firstname} {player.lastname}
                                            </div>
                                            <div className="player-position">
                                                Position: {player.position}
                                            </div>
                                            <div className="player-team">
                                                Team: {player.team}
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => onRemovePlayer(player.id)}
                                            >
                                                Remove
                                            </button>
                                        </>
                                    ) : (
                                        <div className="empty-slot">Empty BC Slot</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // LIST VIEW -> 5 vertical slots
                <div className="list-view">
                    <div className="front-court-list">
                        <h3>Front Court</h3>
                        {fcSlots.map((player, index) => (
                            <div key={index} className="fc-slot-list">
                                {player ? (
                                    <>
                                        <div className="player-name">
                                            {player.firstname} {player.lastname}
                                        </div>
                                        <div className="player-position">
                                            Position: {player.position}
                                        </div>
                                        <div className="player-team">
                                            Team: {player.team}
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => onRemovePlayer(player.id)}
                                        >
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <div className="empty-slot">Empty FC Slot</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="back-court-list">
                        <h3>Back Court</h3>
                        {bcSlots.map((player, index) => (
                            <div key={index} className="bc-slot-list">
                                {player ? (
                                    <>
                                        <div className="player-name">
                                            {player.firstname} {player.lastname}
                                        </div>
                                        <div className="player-position">
                                            Position: {player.position}
                                        </div>
                                        <div className="player-team">
                                            Team: {player.team}
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => onRemovePlayer(player.id)}
                                        >
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <div className="empty-slot">Empty BC Slot</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SquadSelection;
