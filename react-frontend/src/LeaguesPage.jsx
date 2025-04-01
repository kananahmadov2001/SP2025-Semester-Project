// react-frontend/src/LeaguesPage.jsx

import React, { useEffect, useState } from "react";
import { UseAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LEAGUES_URL, LEADERBOARD_URL } from "./config/constants";
import "./LeaguesPage.css";

/**
 * LeaguesPage:
 * - Displays all available leagues
 * - Shows which leagues the current user has joined
 * - Lists each league's members along with their total HFL scores
 * - Highlights the league(s) the user is in and highlights the user in that league
 * - Allows user to create, join, and quit a league
 */
function LeaguesPage() {
  const { user } = UseAuth();
  const navigate = useNavigate();

  // List of all leagues (with membership & score info)
  const [leagues, setLeagues] = useState([]);

  // Input fields for creating or joining a league
  const [newLeagueName, setNewLeagueName] = useState("");
  const [joinLeagueId, setJoinLeagueId] = useState("");

  // Display messages (success/error)
  const [message, setMessage] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  /**
   * On mount: fetch scoreboard (all user scores), then fetch leagues, then fetch each league's members,
   * merge scores into members, and reorder the leagues so that user's leagues come first.
   */
  useEffect(() => {
    if (!user) return; // Should be protected route, but just in case
    fetchAllData();
  }, [user]);

  /**
   * Fetches everything needed:
   *  1) All user scores from the global scoreboard.
   *  2) All leagues
   *  3) For each league, fetch the league's members
   *  4) Merge scores, highlight user, reorder leagues so user’s leagues appear first
   */
  async function fetchAllData() {
    try {
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
        // GET /leagues?leagueId=xxx -> returns { league_members: [ {user_id, username}, ... ] }
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

      // 4) Reorder so that user’s joined leagues appear first
      const myLeagues = leaguesWithMembers.filter((l) =>
        l.members.some((m) => m.user_id === Number(user.userId))
      );
      const otherLeagues = leaguesWithMembers.filter(
        (l) => !l.members.some((m) => m.user_id === Number(user.userId))
      );

      // Put user leagues at the top
      setLeagues([...myLeagues, ...otherLeagues]);
    } catch (err) {
      console.error("Error in fetchAllData:", err);
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handle creation of a new league
   */
  async function handleCreateLeague() {
    setMessage("");
    if (!newLeagueName.trim()) return;

    try {
      const response = await fetch(`${LEAGUES_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          leagueName: newLeagueName,
          userId: user.userId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create league.");

      setMessage(`League '${newLeagueName}' created successfully!`);
      setNewLeagueName("");

      // Refresh data
      fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  /**
   * Handle joining a league by ID
   */
  async function handleJoinLeague() {
    setMessage("");
    if (!joinLeagueId.trim()) return;

    try {
      const response = await fetch(`${LEAGUES_URL}/join`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userId, leagueId: joinLeagueId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to join league.");

      setMessage("Successfully joined league!");
      setJoinLeagueId("");

      // Refresh data
      fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  /**
   * Handle quitting (leaving) a league if the user is already in it.
   */
  async function handleQuitLeague(leagueId) {
    setMessage("");

    try {
      // Send DELETE request to /leagues/quit
      const response = await fetch(`${LEAGUES_URL}/quit`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userId, leagueId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to quit league.");
      }

      setMessage(data.message || "You have left the league.");
      // Refresh data
      fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  // ---- RENDER ----
  return (
    <div className="leagues-page">
      <h1>League Management</h1>
      {message && <p className="message">{message}</p>}

      {/* Create / Join League UI */}
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

      {/* List of Leagues */}
      <div className="league-list">
        <h2>Available Leagues</h2>
        {isLoading && <p>Loading leagues...</p>}

        {!isLoading && leagues.length === 0 && (
          <p>No leagues found. Create one above!</p>
        )}

        <div className="league-cards">
          {leagues.map((league) => {
            // Check if user is in this league
            const isUserInLeague = league.members.some(
              (m) => m.user_id === Number(user.userId)
            );

            return (
              <div
                key={league.league_id}
                className={`league-card ${isUserInLeague ? "highlight-league" : ""}`}
              >
                <p className="league-name">
                  <strong>{league.league_name}</strong>{" "}
                  {isUserInLeague && <span className="joined-tag">[Joined]</span>}
                </p>
                <p className="league-id">League ID: {league.league_id}</p>

                <p>Members: {league.members.length} / 8</p>
                <ul className="user-list">
                  {league.members.map((u) => (
                    <li
                      key={u.user_id}
                      className={u.user_id === Number(user.userId) ? "highlighted-user" : ""}
                    >
                      {u.username || `User ${u.user_id}`} —{" "}
                      <strong>{u.total_score} pts</strong>
                    </li>
                  ))}
                </ul>

                {/* Quit League Button */}
                {isUserInLeague && (
                  <button
                    className="quit-league-btn"
                    onClick={() => handleQuitLeague(league.league_id)}
                  >
                    Quit League
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LeaguesPage;
