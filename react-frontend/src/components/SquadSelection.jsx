// react-frontend/src/components/SquadSelection.jsx
import React, { useState } from "react";
import "./SquadSelection.css";
import { getCourtType } from "../utils/utilityFunctions";
import PlayerModal from "./PlayerModal";
import getPlayerImage from "../getPlayerImage";


function SquadSelection({ userTeam, onRemovePlayer }) {
    const [viewType, setViewType] = useState("court");

    // 1) State for the player the user clicked
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // 2) Partition the user team
    const frontCourtPlayers = userTeam.filter((p) => getCourtType(p.position) === "front");
    const backCourtPlayers = userTeam.filter((p) => getCourtType(p.position) === "back");

    const fcSlots = Array.from({ length: 5 }, (_, idx) => frontCourtPlayers[idx] || null);
    const bcSlots = Array.from({ length: 5 }, (_, idx) => backCourtPlayers[idx] || null);

    const selectedPlayersCount = userTeam.length;
    const [moneyRemaining, setMoneyRemaining] = useState(100.0);

    function handlePlayerClick(player) {
        // 3) Open the modal by setting selectedPlayer
        setSelectedPlayer(player);
    }


    return (
        <div className="squad-selection-container">
            <div className="squad-header">
                <span className="players-selected">
                    Players Selected: {selectedPlayersCount} / 10
                </span>
                <span className="money-remaining">
                    Money Remaining: {moneyRemaining.toFixed(1)}
                </span>
            </div>

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
                <div className="court-view">
                    <div className="front-court">
                        <h3>Front Court</h3>
                        <div className="fc-row">
                            {fcSlots.slice(0, 3).map((player, index) => (
                                <div key={index} className="fc-slot">
                                    {player ? (
                                        <div className="squad-select-player-card" onClick={() => handlePlayerClick(player)}>
                                            <div className="player-image">
                                                <img
                                                    src={getPlayerImage(player.team)}
                                                    alt={`${player.firstname} ${player.lastname}`}
                                                    className="player-logo"
                                                />
                                            </div>
                                            <div
                                                className="player-name"
                                            >
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
                                        </div>
                                    ) : (
                                        <div className="empty-slot">Empty FC Slot</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* second row of FC */}
                        <div className="fc-row">
                            {fcSlots.slice(3, 5).map((player, index) => (
                                <div key={index + 3} className="fc-slot">
                                    {player ? (
                                        <div className="squad-select-player-card" onClick={() => handlePlayerClick(player)}>
                                            <div className="player-image">
                                                <img
                                                    src={getPlayerImage(player.team)}
                                                    alt={`${player.firstname} ${player.lastname}`}
                                                    className="player-logo"
                                                />
                                            </div>
                                            <div
                                                className="player-name"
                                            >
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
                                        </div>
                                    ) : (
                                        <div className="empty-slot">Empty FC Slot</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* back-court container */}
                    <div className="back-court">
                        <h3>Back Court</h3>
                        <div className="bc-row">
                            {bcSlots.slice(0, 3).map((player, index) => (
                                <div key={index} className="bc-slot">
                                    {player ? (
                                        <div className="squad-select-player-card" onClick={() => handlePlayerClick(player)}>
                                            <div className="player-image">
                                                <img
                                                    src={getPlayerImage(player.team)}
                                                    alt={`${player.firstname} ${player.lastname}`}
                                                    className="player-logo"
                                                />
                                            </div>
                                            <div
                                                className="player-name"
                                            >
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
                                        </div>
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
                                        <div className="squad-select-player-card" onClick={() => handlePlayerClick(player)}>
                                            <div className="player-image">
                                                <img
                                                    src={getPlayerImage(player.team)}
                                                    alt={`${player.firstname} ${player.lastname}`}
                                                    className="player-logo"
                                                />
                                            </div>
                                            <div
                                                className="player-name"
                                            >
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
                                        </div>
                                    ) : (
                                        <div className="empty-slot">Empty BC Slot</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // LIST VIEW
                <div className="list-view">
                    <div className="front-court-list">
                        <h3>Front Court</h3>
                        {fcSlots.map((player, index) => (
                            <div key={index} className="fc-slot-list">
                                {player ? (
                                    <div className="squad-select-player-card-list" onClick={() => handlePlayerClick(player)}>
                                        <div
                                            className="player-name"
                                        >
                                            {player.firstname} {player.lastname}
                                        </div>
                                        <div className="player-position">Position: {player.position}</div>
                                        <div className="player-team">Team: {player.team}</div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => onRemovePlayer(player.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
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
                                    <div className="squad-select-player-card-list" onClick={() => handlePlayerClick(player)}>
                                        <div
                                            className="player-name"
                                        >
                                            {player.firstname} {player.lastname}
                                        </div>
                                        <div className="player-position">Position: {player.position}</div>
                                        <div className="player-team">Team: {player.team}</div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => onRemovePlayer(player.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-slot">Empty BC Slot</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4) If there's a selectedPlayer, show the modal with hideAddButton = true */}
            {selectedPlayer && (
                <PlayerModal
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    hideAddButton={true}
                />
            )}
        </div>
    );
}

export default SquadSelection;
