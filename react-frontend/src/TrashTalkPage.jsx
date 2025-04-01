// react-frontend/src/TrashTalkPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./TrashTalkPage.css";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000"); // Connect to the backend


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
      text: "Why did I draft Ben Simmons?",
      isSelf: false,
    },
  ]);

  // ✅ Fetch messages from MySQL on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/messages");
        console.log("hi");
        setGlobalTrashTalk(response.data.reverse()); // Reverse to show oldest first
        console.log(globalTrashTalk);
        console.log("hi2");
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // ✅ Listen for new messages via WebSocket
    socket.on("receiveMessage", (message) => {
      setGlobalTrashTalk((prev) => [...prev, message]); // Append new messages
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  function handleSignOut() {
    logout();               // Clear user from context
    navigate("/");          // Redirect to home (or wherever you want)
  }

  // ✅ Send message
  const handleGlobalPost = () => {
    if (globalMessage.trim() === "") return;

    const newMessage = {
      username: user?.name || "Anonymous", // Ensure username is set
      message: globalMessage,
    }

    // Emit message via WebSocket (backend will save to MySQL)
    socket.emit("sendMessage", newMessage);
    setGlobalMessage(""); // Clear input
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

      {/* Global Chat Section */}
      <section className="chat-section">
        <h2>Global Chat</h2>
        <div className="chat-box">
          <div className="chat-messages">
            {globalTrashTalk.map((post) => (
              <div
                key={post.id}
                className={`chat-message ${post.username == user.name ? "self" : "other"}`}
              >
                <strong>{post.username}:</strong> {post.message}
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
    </div>
  );
}

export default TrashTalkPage;
