import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LEADERBOARD_URL } from "./config/constants";
import "./TrashTalkPage.css";
import io from "socket.io-client";
import { UseAuth } from "../src/context/AuthContext";

const socket = io("http://localhost:3000");

function TrashTalkPage() {
  const navigate = useNavigate();
  const { user, logout } = UseAuth();
  if (!user) return <Navigate to="/" replace />;

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalTrashTalk, setGlobalTrashTalk] = useState([]);

  useEffect(() => {
    // Listen for global messages from the server
    socket.on("globalMessage", (message) => {
      const newMessage = {
        ...message,
        isSelf: false,
      };
      setGlobalTrashTalk((prev) => [...prev, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("globalMessage");
    };
  }, []);

  const handleGlobalPost = () => {
    if (globalMessage.trim() !== "") {
      const newMessage = {
        id: globalTrashTalk.length + 1,
        user: user?.name || "You",
        text: globalMessage,
        isSelf: true,
      };
      socket.emit("globalMessage", newMessage);
      setGlobalTrashTalk([...globalTrashTalk, newMessage]);
      setGlobalMessage("");
    }
  };

  return (
    <div className="trash-talk-page">
      {/* Global Chat Section */}
      <section className="chat-section">
        <h2>Global Chat</h2>
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
