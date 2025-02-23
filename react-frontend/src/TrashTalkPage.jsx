import React, { useState, useEffect } from "react";
import "./TrashTalkPage.css";
import { useNavigate } from "react-router-dom";

function TrashTalkPage() {
  const [message, setMessage] = useState("");
  const [trashTalk, setTrashTalk] = useState([
    { id: 1, user: "HFL_Champ", text: "Russell Westbrook just hit the side of the backboard again. 😂" },
    { id: 2, user: "TrashTalkKing", text: "LeBron’s hairline is making more comebacks than the Cavs in 2016!" },
    { id: 3, user: "BenchWarmer", text: "Draymond Green just fouled out in record time. Respect. 😆" },
  ]);

  const handlePost = () => {
    if (message.trim() !== "") {
      const newMessage = { id: trashTalk.length + 1, user: "You", text: message };
      setTrashTalk([newMessage, ...trashTalk]);
      setMessage(""); // Clear input after posting
    }
  };

  return (
    <div className="trash-talk-page">
      <h1>🔥 Trash Talk Zone 🔥</h1>
      <p>Roast bad performances, drop your hot takes, and call out the biggest flops of the week!</p>

      {/* Input Section */}
      <div className="trash-talk-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your trash talk here..."
        />
        <button className="post-btn" onClick={handlePost}>Post</button>
      </div>

      {/* Trash Talk Messages */}
      <div className="trash-talk-messages">
        {trashTalk.map((post) => (
          <div key={post.id} className="trash-message">
            <strong>{post.user}:</strong> {post.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrashTalkPage;