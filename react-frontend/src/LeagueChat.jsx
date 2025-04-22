// LeagueChat.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { CHAT_URL } from "./config/constants";


const socket = io("http://localhost:3000");

function LeagueChat({ selectedLeague, user }) {
    const [leagueMessage, setLeagueMessage] = useState("");
    const [leagueTrashTalk, setLeagueTrashTalk] = useState([]);

    useEffect(() => {
        const fetchLeagueMessages = async () => {
          try {
            const res = await fetch(`${CHAT_URL}?leagueId=${selectedLeague}`);
            const data = await res.json();
            setLeagueTrashTalk(
              data.messages.map((msg) => ({
                ...msg,
                isSelf: msg.user === user.name,
              }))
            );
          } catch (error) {
            console.error("Failed to load league messages:", error);
          }
        };
      
        if (selectedLeague) {
          socket.emit("joinLeague", selectedLeague);
          fetchLeagueMessages();
        }
      
        const handleLeagueMessage = (message) => {
          const newMsg = { ...message, isSelf: false };
          setLeagueTrashTalk((prev) => [...prev, newMsg]);
        };
      
        socket.on("leagueMessage", handleLeagueMessage);
      
        return () => socket.off("leagueMessage", handleLeagueMessage);
      }, [selectedLeague]);
      
      

      const handleLeaguePost = async () => {
        if (leagueMessage.trim() !== "") {
          const newMessage = {
            user: user.name,
            text: leagueMessage,
            leagueId: selectedLeague,
          };
      
          try {
            const res = await fetch(CHAT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newMessage),
            });
      
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send league message.");
      
            socket.emit("leagueMessage", newMessage, selectedLeague);
            setLeagueTrashTalk((prev) => [...prev, { ...newMessage, isSelf: true }]);
            setLeagueMessage("");
          } catch (error) {
            console.error("Error posting league message:", error);
          }
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
