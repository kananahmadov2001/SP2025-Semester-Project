// LeagueChat.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function LeagueChat({ selectedLeague, user }) {
    const [leagueMessage, setLeagueMessage] = useState("");
    const [leagueTrashTalk, setLeagueTrashTalk] = useState([]);

    useEffect(() => {
        if (selectedLeague) {
            socket.emit("joinLeague", selectedLeague); // Join league room
            setLeagueTrashTalk([]); // Clear old messages
        }

        const handleLeagueMessage = (message) => {
            const newMsg = { ...message, isSelf: false };
            setLeagueTrashTalk((prev) => [...prev, newMsg]);
        };

        socket.on("leagueMessage", handleLeagueMessage);

        return () => {
            socket.off("leagueMessage", handleLeagueMessage);
        };
    }, [selectedLeague]);

    const handleLeaguePost = () => {
        if (leagueMessage.trim() !== "") {
            const newMessage = {
                id: leagueTrashTalk.length + 1,
                user: user?.name || "You",
                text: leagueMessage,
                isSelf: true,
            };
            socket.emit("leagueMessage", newMessage, selectedLeague);
            setLeagueTrashTalk((prev) => [...prev, newMessage]);
            setLeagueMessage("");
        }
    };

    if (!selectedLeague) return null;

    return (
        <section className="chat-section">
            <h2>League Chat</h2>
            <div className="chat-box">
                <div className="chat-messages">
                    {leagueTrashTalk.map((post) => (
                        <div
                            key={post.id}
                            className={`chat-message ${post.isSelf ? "self" : "other"}`}
                        >
                            <strong>{post.user}:</strong> {post.text}
                        </div>
                    ))}
                </div>
                <textarea
                    value={leagueMessage}
                    onChange={(e) => setLeagueMessage(e.target.value)}
                    placeholder="Talk trash within your league..."
                />
                <button className="post-btn" onClick={handleLeaguePost}>
                    Send
                </button>
            </div>
        </section>
    );
}

export default LeagueChat;
