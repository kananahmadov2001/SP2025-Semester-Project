// react-frontend/src/TrashTalkPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LEADERBOARD_URL } from "./config/constants";
import "./TrashTalkPage.css";
import io from "socket.io-client";
import { UseAuth } from "../src/context/AuthContext";
import { CHAT_URL } from "./config/constants";


const socket = io("http://localhost:3000");

function TrashTalkPage() {
  const navigate = useNavigate();
  const { user, logout } = UseAuth();
  if (!user) return <Navigate to="/" replace />;

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalTrashTalk, setGlobalTrashTalk] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(CHAT_URL);
        const data = await res.json();

        // Check if data.messages exists and is an array, else set default empty array
        const messages = Array.isArray(data.messages) ? data.messages : [];

        setGlobalTrashTalk(
          messages.map((msg) => ({
            ...msg,
            isSelf: msg.user === user.name,
          }))
        );
      } catch (error) {
        console.error("Failed to load global chat:", error);
      }
    };

    fetchMessages();

    socket.on("globalMessage", (message) => {
      const newMessage = { ...message, isSelf: false };
      setGlobalTrashTalk((prev) => [...prev, newMessage]);
    });

    return () => socket.off("globalMessage");
  }, []);



  const handleGlobalPost = async () => {
    if (globalMessage.trim() !== "") {
      const newMessage = {
        user: user.name,
        text: globalMessage,
      };

      try {
        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send message.");

        socket.emit("globalMessage", newMessage);
        setGlobalTrashTalk((prev) => [...prev, { ...newMessage, isSelf: true }]);
        setGlobalMessage("");
      } catch (error) {
        console.error("Error posting global message:", error);
      }
    }
  };



  return (
    <div className="trash-talk-page">
      {/* Global Chat Section */}
      <section className="chat-section">
        <h2>Trash Talk Zone</h2>
        <div className="chat-box">
          <div className="chat-messages">
            {globalTrashTalk.map((post) => (
              <div
                key={post.id}
                className={`chat-message ${post.isSelf ? "self" : "other"}`}
              >
                <strong>{post.user}:</strong> {post.text}
              </div>
            ))}
          </div>
          <textarea
            value={globalMessage}
            onChange={(e) => setGlobalMessage(e.target.value)}
            placeholder="Talk trash with the world..."
          />
          <button className="post-btn" onClick={handleGlobalPost}>
            Send
          </button>
        </div>
      </section>
    </div>
  );
}

export default TrashTalkPage;
