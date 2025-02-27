// react-frontend/src/TrashTalkPage.jsx

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./TrashTalkPage.css";

// 1) Import from AuthContext
import { UseAuth } from "../src/context/AuthContext";

function TrashTalkPage() {
  const navigate = useNavigate();

  // 2) Destructure user & logout from context
  const { user, logout } = UseAuth();
  if (!user) return <Navigate to="/" replace />;

  const [globalMessage, setGlobalMessage] = useState("");
  const [leagueMessage, setLeagueMessage] = useState("");

  const [globalTrashTalk, setGlobalTrashTalk] = useState([
    {
      id: 1,
      user: "TrashTalkKing",
      text: "LeBron’s hairline is making more comebacks than the Cavs in 2016!",
      isSelf: false,
    },
  ]);

  const [leagueTrashTalk, setLeagueTrashTalk] = useState([
    {
      id: 1,
      user: "LeagueMaster",
      text: "Why did I draft Ben Simmons? 😂",
      isSelf: false,
    },
  ]);

  function handleSignOut() {
    logout();               // Clear user from context
    navigate("/");          // Redirect to home (or wherever you want)
  }

  const handleGlobalPost = () => {
    if (globalMessage.trim() !== "") {
      // We can show the actual user.name instead of "You"
      const newMessage = {
        id: globalTrashTalk.length + 1,
        user: user?.name || "You",
        text: globalMessage,
        isSelf: true,
      };
      setGlobalTrashTalk([...globalTrashTalk, newMessage]);
      setGlobalMessage("");
    }
  };

  const handleLeaguePost = () => {
    if (leagueMessage.trim() !== "") {
      const newMessage = {
        id: leagueTrashTalk.length + 1,
        user: user?.name || "You",
        text: leagueMessage,
        isSelf: true,
      };
      setLeagueTrashTalk([...leagueTrashTalk, newMessage]);
      setLeagueMessage("");
    }
  };

  return (
    <div className="trash-talk-page">
      {/* Top Bar with Navigation */}
      <div className="top-bar">
        <h2>🔥 The Ultimate Trash Talk Zone 🔥</h2>
        <div className="nav-buttons">
          <button onClick={() => navigate("/dashboard")} className="nav-btn">
            🏀 Go to Dashboard
          </button>
          {/* Use the logout function */}
          <button className="sign-out-btn" onClick={handleSignOut}>
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Global Chat Section */}
      <section className="chat-section">
        <h2>🌎 Global Chat</h2>
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

      {/* League Chat Section */}
      <section className="chat-section">
        <h2>🏆 League Chat</h2>
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
    </div>
  );
}

export default TrashTalkPage;
