import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LEAGUES_URL, LEADERBOARD_URL } from "./config/constants";
import "./TrashTalkPage.css";
import io from "socket.io-client";

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
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");



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

  const [selectedLeague, setSelectedLeague] = useState(null); // To track the selected league

  useEffect(() => {
    async function fetchAllData() {
      try {
        // Set loading state
        setIsLoading(true);

        // 1) Fetch large scoreboard so we have everyone's total_score
        const scoresResp = await fetch(`${LEADERBOARD_URL}?page=1&limit=999999`, {
          credentials: "include",
        });
        const scoresData = await scoresResp.json();
        if (!scoresResp.ok || !scoresData.leaderboard) {
          throw new Error(scoresData.error || "Failed to fetch scoreboard data.");
        }
        // Create a map: user_id -> total_score
        const userScoreMap = {};
        scoresData.leaderboard.forEach((row) => {
          userScoreMap[row.user_id] = row.total_score;
        });

        // 2) Fetch all leagues
        const leaguesResp = await fetch(LEAGUES_URL, { credentials: "include" });
        const leaguesData = await leaguesResp.json();
        if (!leaguesResp.ok) {
          throw new Error(leaguesData.error || "Failed to fetch leagues.");
        }
        let allLeagues = leaguesData.leagues || [];

        // 3) For each league, fetch the league's members and merge scores
        const leaguesWithMembers = [];
        for (const league of allLeagues) {
          const membersResp = await fetch(`${LEAGUES_URL}?leagueId=${league.league_id}`, {
            credentials: "include",
          });
          const membersData = await membersResp.json();

          let leagueMembers = [];
          if (membersResp.ok && membersData.league_members) {
            leagueMembers = membersData.league_members;
          }

          // Merge each member with their total_score
          leagueMembers = leagueMembers.map((m) => ({
            ...m,
            total_score: userScoreMap[m.user_id] || 0,
          }));

          // Sort members by total_score descending
          leagueMembers.sort((a, b) => b.total_score - a.total_score);

          leaguesWithMembers.push({
            league_id: league.league_id,
            league_name: league.league_name,
            members: leagueMembers,
          });
        }

        // 4) Reorder leagues so the user's leagues appear first
        const myLeagues = leaguesWithMembers.filter((l) =>
          l.members.some((m) => m.user_id === Number(user.userId))
        );
        setLeagues(myLeagues); // Set only leagues the user has joined
      } catch (err) {
        console.error("Error in fetchAllData:", err);
        setMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();

    // Listen for global messages from the server
    socket.on("globalMessage", (message) => {
      const newMessage = {
        ...message,
        isSelf: false,
      };
      setGlobalTrashTalk((prev) => [...prev, newMessage]);
    });

    // Listen for league-specific messages
    socket.on("leagueMessage", (message) => {
      const newMessage = {
        ...message,
        isSelf: false,
      };
      setLeagueTrashTalk((prev) => [...prev, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("globalMessage");
      socket.off("leagueMessage");
    };
  }, []);

  // Handle selecting a league
  const handleLeagueSelection = (leagueId) => {
    setSelectedLeague(leagueId);
    // Notify the server that the user has joined a league
    socket.emit("joinLeague", leagueId);
  };

  // Posting messages as before...
  const handleGlobalPost = () => {
    if (globalMessage.trim() !== "") {
      const newMessage = {
        id: globalTrashTalk.length + 1,
        user: user?.name || "You",
        text: globalMessage,
        isSelf: true,
      };
      socket.emit("globalMessage", newMessage); // Send message to the server
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
      socket.emit("leagueMessage", newMessage, selectedLeague); // Send message to the league
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

      {/* League Selection with Radio Buttons */}
      {leagues.length > 0 && (
        <section className="league-selection">
          <h2>Select Your League</h2>
          <div>
            {leagues.map((league) => (
              <label key={league.league_id} className="league-radio">
                <input
                  type="radio"
                  name="league"
                  value={league.league_id}
                  checked={selectedLeague === league.league_id}
                  onChange={() => handleLeagueSelection(league.league_id)}
                />
                {league.league_name}
              </label>
            ))}
          </div>
        </section>
      )}

      {/* League Chat Section */}
      {selectedLeague && (
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
      )}
    </div>
  );
}

export default TrashTalkPage;
