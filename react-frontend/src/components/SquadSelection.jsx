// react-frontend/src/components/SquadSelection.jsx
import React, { useMemo, useState } from "react";
import "./SquadSelection.css";
import { getCourtType } from "../utils/utilityFunctions";
import PlayerModal from "./PlayerModal";
import getPlayerImage from "../getPlayerImage";

function PlayerCard({
    player,
    isStarter,
    onRemove,
    onToggleStarter,
    onClick,
    disablePromote,
}) {
    return (
        <div
            className={`sq-card ${isStarter ? "starter" : "bench"}`}
            onClick={() => onClick(player)}
        >
            <img
                src={getPlayerImage(player.team)}
                alt={`${player.firstname} ${player.lastname}`}
                className="sq-logo"
            />
            <div className="sq-name">
                {player.firstname} {player.lastname}
            </div>
            <div className="sq-pos">{player.position}</div>
            <div className="sq-team">{player.team}</div>

            {/* action buttons – stopPropagation so the outer div still acts as click‑to‑open‑modal */}
            <button
                className="sq-btn remove"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(player.id);
                }}
            >
                Remove
            </button>

            <button
                className="sq-btn toggle"
                disabled={disablePromote}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleStarter(player.id, isStarter);
                }}
            >
                {isStarter ? "Send to Bench" : "Make Starter"}
            </button>

            {isStarter && <div className="sq-starter-badge">✅ Starter</div>}
        </div>
    );
}

export default function SquadSelection({
    userTeam = [],
    onRemovePlayer,
    onToggleStarter,
}) {
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    /* -------- derived info (expensive filter only once) ------------------- */
    const { starters, bench, starterCount, frontCt, backCt } = useMemo(() => {
        const starters = userTeam.filter((p) => p.is_starter);
        const bench = userTeam.filter((p) => !p.is_starter);
        const frontCt = starters.filter((p) => getCourtType(p.position) === "front");
        const backCt = starters.filter((p) => getCourtType(p.position) === "back");
        return {
            starters,
            bench,
            starterCount: starters.length,
            frontCt,
            backCt,
        };
    }, [userTeam]);

    /* -------- promote / demote with swap logic --------------------------- */
    async function handleToggleStarter(id, currentlyStarter) {
        // 1) if demoting -> just flip
        if (currentlyStarter) {
            await onToggleStarter(id); // parent handles refresh
            return;
        }

        // 2) PROMOTE CASE
        if (starterCount < 5) {
            await onToggleStarter(id);
            return;
        }

        // 3) SWAP CASE – pick a victim starter to demote (oldest one by default)
        //    You could open a modal here; for now choose the first starter not the same court type
        const victim =
            getCourtType(userTeam.find((p) => p.id === id).position) === "front"
                ? frontCt[0]
                : backCt[0] || starters[0];

        if (victim) {
            await onToggleStarter(victim.id); // bench him first
            await onToggleStarter(id); // then promote newcomer
        } else {
            // Fallback: refuse if something went very wrong
            alert("Cannot swap – court‑type limits would be broken.");
        }
    }

    /* -------------------------------------------------------------------- */
    return (
        <div className="sq-wrapper">
            {/* header */}
            <header className="sq-header">
                <span>
                    Players: {userTeam.length} / 10 &nbsp;|&nbsp; Starters:{" "}
                    {starterCount} / 5
                </span>
            </header>

            {/* starters grid */}
            <section className="sq-starters">
                <h3>Starters:</h3>
                <div className="sq-grid">
                    {starters.length === 0 && (
                        <div className="sq-empty">No starters selected.</div>
                    )}

                    {starters.map((p) => (
                        <PlayerCard
                            key={p.id}
                            player={p}
                            isStarter
                            onRemove={onRemovePlayer}
                            onToggleStarter={handleToggleStarter}
                            onClick={setSelectedPlayer}
                        />
                    ))}
                </div>
            </section>

            {/* bench list */}
            <section className="sq-bench">
                <h3>Bench:</h3>
                {bench.length === 0 ? (
                    <p>No bench players.</p>
                ) : (
                    bench.map((p) => (
                        <PlayerCard
                            key={p.id}
                            player={p}
                            isStarter={false}
                            onRemove={onRemovePlayer}
                            onToggleStarter={handleToggleStarter}
                            onClick={setSelectedPlayer}
                            disablePromote={starterCount === 5 && p.is_starter === false}
                        />
                    ))
                )}
            </section>

            {/* modal – read‑only when invoked here */}
            {selectedPlayer && (
                <PlayerModal
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    hideAddButton
                />
            )}
        </div>
    );
}
