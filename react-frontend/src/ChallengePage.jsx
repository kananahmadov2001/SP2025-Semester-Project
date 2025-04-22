// react-frontend/src/ChallengePage.jsx
import React, { useState, useEffect } from "react";
import PlayerModal from "./PlayerModal";
import { PLAYERS_URL, CHALLENGE_URL } from "./config/constants";
import "./ChallengePage.css";

export default function ChallengePage() {
    const [clips, setClips] = useState([]);
    const [players, setPlayers] = useState([]);
    const [form, setForm] = useState({
        playerId: "",
        youtubeUrl: "",
        title: "",
        description: ""
    });
    const [modalPlayer, setModalPlayer] = useState(null);

    // Fetch players and clips on mount
    useEffect(() => {
        // Load all players for selector
        fetch(`${PLAYERS_URL}?limit=1000`)
            .then((r) => r.json())
            .then((data) => setPlayers(data.players || []))
            .catch(console.error);
        // Load all clips and sort by net votes
        fetch(CHALLENGE_URL)
            .then((r) => r.json())
            .then((data) => {
                const sorted = (data.clips || []).sort(
                    (a, b) => (b.thumbs_up - b.thumbs_down) - (a.thumbs_up - a.thumbs_down)
                );
                setClips(sorted);
            })
            .catch(console.error);
    }, []);

    // Handle form input changes
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    // Submit a new clip
    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.playerId || !form.youtubeUrl) {
            return alert("Player and URL are required");
        }
        const resp = await fetch(CHALLENGE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form)
        });
        const data = await resp.json();
        if (resp.ok) {
            // Prepend new clip and re‑sort
            setClips((c) => [data.clip, ...c].sort(
                (a, b) => (b.thumbs_up - b.thumbs_down) - (a.thumbs_up - a.thumbs_down)
            ));
            setForm({ playerId: "", youtubeUrl: "", title: "", description: "" });
        } else {
            alert(data.error || "Failed to post clip");
        }
    }

    // Vote (up or down) on a clip
    async function handleVote(id, type) {
        await fetch(`${CHALLENGE_URL}/${id}/${type}`, {
            method: "POST",
            credentials: "include"
        });
        // Optimistically update UI
        setClips((c) =>
            c.map((clip) =>
                clip.id === id
                    ? { ...clip, [type === "upvote" ? "thumbs_up" : "thumbs_down"]: clip[type === "upvote" ? "thumbs_up" : "thumbs_down"] + 1 }
                    : clip
            ).sort((a, b) => (b.thumbs_up - b.thumbs_down) - (a.thumbs_up - a.thumbs_down))
        );
    }

    return (
        <div className="challenge-container">
            <form className="clip-form" onSubmit={handleSubmit}>
                <label>Player:</label>
                <input
                    list="player-list"
                    name="playerId"
                    value={form.playerId}
                    onChange={handleChange}
                    required
                />
                <datalist id="player-list">
                    {players.map((p) => (
                        <option key={p.id} value={p.id}>{p.firstname} {p.lastname}</option>
                    ))}
                </datalist>

                <label>YouTube URL:</label>
                <input
                    type="url"
                    name="youtubeUrl"
                    value={form.youtubeUrl}
                    onChange={handleChange}
                    required
                />

                <label>Title (optional):</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                />

                <label>Description (optional):</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                />

                <button type="submit">Post Clip</button>
            </form>

            <div className="clips-grid">
                {clips.map((clip) => {
                    const player = players.find((p) => p.id === clip.player_id);
                    return (
                        <div key={clip.id} className="clip-card">
                            <div
                                className="clip-player"
                                onClick={() => setModalPlayer(player)}
                            >
                                {player?.firstname} {player?.lastname}
                            </div>
                            {clip.title && <h4>{clip.title}</h4>}
                            {clip.description && <p>{clip.description}</p>}
                            <a
                                href={clip.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Watch Clip
                            </a>
                            <div className="clip-actions">
                                <button onClick={() => handleVote(clip.id, "upvote")}>
                                    👍 {clip.thumbs_up}
                                </button>
                                <button onClick={() => handleVote(clip.id, "downvote")}>
                                    👎 {clip.thumbs_down}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {modalPlayer && (
                <PlayerModal
                    player={modalPlayer}
                    onClose={() => setModalPlayer(null)}
                    hideAddButton={true}
                />
            )}
        </div>
    );
}
