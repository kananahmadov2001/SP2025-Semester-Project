// react-frontend/src/LeaguesPage.jsx

import React, { useEffect, useState } from "react";
import { UseAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LeaguesPage.css";

function LeaguesPage() {
  const { user } = UseAuth();
  const navigate = useNavigate();

  const [leagues, setLeagues] = useState([]);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [joinLeagueId, setJoinLeagueId] = useState("");
  const [message, setMessage] = useState("");
  const [leagueMembers, setLeagueMembers] = useState({});

  useEffect(() => {
    fetchLeagues();
  }, []);

  async function fetchLeagues() {
    try {
      const response = await fetch("http://localhost:3000/api/leagues", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setLeagues(data.leagues || []);
        // Fetch members for each league
        data.leagues?.forEach(async (league) => {
          const membersResp = await fetch(`http://localhost:3000/api/leagues?leagueId=${league.league_id}`);
          const membersData = await membersResp.json();
          setLeagueMembers(prev => ({ ...prev, [league.league_id]: membersData.league_members || [] }));
        });
      } else {
        throw new Error(data.error || "Failed to fetch leagues");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error loading leagues.");
    }
  }

  async function handleCreateLeague() {
    if (!newLeagueName.trim()) return;
    try {
      const response = await fetch("http://localhost:3000/api/leagues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ leagueName: newLeagueName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create league");

      const createdLeague = {
        league_id: data.league_id || Date.now(), // fallback if not returned
        league_name: newLeagueName,
      };

      setMessage(`League '${createdLeague.league_name}' created!`);
      setLeagues(prev => [...prev, createdLeague]);
      setNewLeagueName("");
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  async function handleJoinLeague() {
    if (!joinLeagueId.trim()) return;
    try {
      const response = await fetch("http://localhost:3000/api/leagues/join", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userId, leagueId: joinLeagueId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to join league");

      setMessage("Successfully joined league!");
      setJoinLeagueId("");
      fetchLeagues();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  return (
    <div className="leagues-page">
      <h1>League Management</h1>
      {message && <p className="message">{message}</p>}

      <div className="league-actions">
        <div className="create-league">
          <h3>Create a League</h3>
          <input
            type="text"
            placeholder="Enter league name"
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
          />
          <button onClick={handleCreateLeague}>Create League</button>
        </div>

        <div className="join-league">
          <h3>Join a League</h3>
          <input
            type="text"
            placeholder="Enter league ID"
            value={joinLeagueId}
            onChange={(e) => setJoinLeagueId(e.target.value)}
          />
          <button onClick={handleJoinLeague}>Join League</button>
        </div>
      </div>

      <div className="league-list">
        <h2>Available Leagues</h2>
        <ul>
          {leagues.length === 0 ? (
            <li>No leagues available.</li>
          ) : (
            leagues.map((league, idx) => (
              <li key={league.league_id || idx} className="league-item">
                <strong>{league.league_name}</strong> (ID: {league.league_id})<br />
                <span className="member-count">
                  Members: {leagueMembers[league.league_id]?.length || 0} / 8
                </span>
                {leagueMembers[league.league_id] && (
                  <ul className="user-list">
                    {leagueMembers[league.league_id].map((u) => (
                      <li key={u.user_id}>{u.username || `User ${u.user_id}`}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default LeaguesPage;
