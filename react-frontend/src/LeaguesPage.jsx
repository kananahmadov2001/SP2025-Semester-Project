// react-frontend/src/LeaguesPage.jsx

import React, { useEffect, useState } from "react";
import { UseAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LEAGUES_URL, LEADERBOARD_URL } from "./config/constants";
import "./LeaguesPage.css";
import LeagueChat from "./LeagueChat"; // Import the LeagueChat component


/**
 * LeaguesPage:
 * - Displays all available leagues
 * - Shows which leagues the current user has joined
 * - Allows user to create, join, and quit a league
 * - Includes a "League Detail" view for deeper management info
 */
function LeaguesPage() {
  const { user } = UseAuth();
  const navigate = useNavigate();

  // List of all leagues (with membership & score info)
  const [leagues, setLeagues] = useState([]);

  // Input fields for creating a league
  const [newLeagueName, setNewLeagueName] = useState("");

  // Display messages (success/error)
  const [message, setMessage] = useState("");

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // If this is not null, we show the "LeagueDetailView" instead of the main list
  const [selectedLeague, setSelectedLeague] = useState(null);

  /**
   * On mount: fetch scoreboard (all user scores), then fetch leagues & members,
   * merge scores, reorder by “joined first,” etc.
   */
  useEffect(() => {
    if (!user) return; // Should be protected route, but we guard anyway
    fetchAllData();
  }, [user]);

  /**
   * fetchAllData:
   *   1) fetch the entire scoreboard (unpaginated) -> userScoreMap
   *   2) fetch all leagues
   *   3) for each league, fetch its members, merge scores, sort them
   *   4) reorder so user’s joined leagues appear first
   */
  async function fetchAllData() {
    try {
      setIsLoading(true);

      // 1) Fetch scoreboard
      const scoresResp = await fetch(`${LEADERBOARD_URL}?page=1&limit=999999`, {
        credentials: "include",
      });
      const scoresData = await scoresResp.json();
      if (!scoresResp.ok || !scoresData.leaderboard) {
        throw new Error(scoresData.error || "Failed to fetch scoreboard data.");
      }
      // Create map user_id -> total_score
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

      // 3) For each league, fetch that league's members
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

        // Merge each member with total_score, default 0 if missing
        leagueMembers = leagueMembers.map((m) => ({
          ...m,
          total_score: userScoreMap[m.user_id] || 0,
        }));

        // Sort members by descending score
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
      // Clear any selected league if reloading data
      setSelectedLeague(null);
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
      const resp = await fetch(`${LEAGUES_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          leagueName: newLeagueName,
          userId: user.userId,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to create league.");

      setMessage(`League '${newLeagueName}' created successfully!`);
      setNewLeagueName("");

      // Refresh data
      await fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  /**
   * handleJoinLeague: user clicks "Join" on a league they are not in
   */
  async function handleJoinLeague(leagueId) {
    setMessage("");
    try {
      const resp = await fetch(`${LEAGUES_URL}/join`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userId, leagueId }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to join league.");

      setMessage("Successfully joined league!");

      // Refresh data
      await fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  /**
   * handleQuitLeague: user clicks "Quit" on a league they are in
   */
  async function handleQuitLeague(leagueId) {
    setMessage("");

    try {
      // Send DELETE request to /leagues/quit
      const resp = await fetch(`${LEAGUES_URL}/quit`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userId, leagueId }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to quit league.");
      }

      setMessage(data.message || "You have left the league.");
      // Refresh data
      await fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  /**
   * handleLeagueCardClick:
   * If user is in the league, show the "LeagueDetailView" for deeper info
   */
  function handleLeagueCardClick(league) {
    const isUserInLeague = league.members.some(
      (m) => m.user_id === Number(user.userId)
    );
    if (!isUserInLeague) return; // do nothing if user not in league

    setSelectedLeague(league);
    setMessage("");
  }

  return (
    <div className="leagues-page">
      <h1>League Management</h1>
      {message && <p className="message">{message}</p>}

      {/* ---------- CREATE LEAGUE UI ---------- */}
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
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      {selectedLeague ? (
        // Show the detail view if selected
        <LeagueDetailView
          league={selectedLeague}
          user={user}
          onBack={() => setSelectedLeague(null)}
          onQuit={handleQuitLeague}
        />
      ) : (
        // Otherwise list all leagues
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
              const isPrivate = league.league_name.toLowerCase().includes("private");
              const isFull = league.members.length >= 8;

              return (
                <div
                  key={league.league_id}
                  className={`league-card ${isUserInLeague ? "highlight-league" : ""
                    }`}
                  onClick={() => handleLeagueCardClick(league)}
                  style={{ cursor: isUserInLeague ? "pointer" : "default" }}
                >
                  <p className="league-name">
                    <strong>{league.league_name}</strong>{" "}
                    {isUserInLeague && <span className="joined-tag">[Joined]</span>}
                  </p>
                  <p className="league-id">League ID: {league.league_id}</p>

                  <p className="visibility-tag">
                    {isPrivate ? "🔒 Private League" : "🌐 Public League"}
                  </p>
                  {isFull && <p className="full-tag">League Full</p>}

                  <p>Members: {league.members.length} / 8</p>
                  <div className="user-list-row">
                    {league.members.map((u) => (
                      <span
                        key={u.user_id}
                        className={
                          u.user_id === Number(user.userId)
                            ? "highlighted-user"
                            : ""
                        }
                      >
                        {u.username || `User ${u.user_id}`}
                      </span>
                    ))}
                  </div>

                  {/* If not joined, show a "Join" button */}
                  {!isUserInLeague && (
                    <button
                      className="join-league-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // don’t trigger card click
                        handleJoinLeague(league.league_id);
                      }}
                    >
                      ➕ Join League
                    </button>
                  )}

                  {/* If joined, show a "Quit" button */}
                  {isUserInLeague && (
                    <button
                      className="quit-league-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // don’t trigger card click
                        handleQuitLeague(league.league_id);
                      }}
                    >
                      ✖️ Quit League
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaguesPage;

/**
 * LeagueDetailView:
 *  A detailed management view of a single league (shows user scores).
 */
function LeagueDetailView({ league, user, onBack, onQuit }) {
  const isUserInLeague = league.members.some(
    (m) => m.user_id === Number(user.userId)
  );

  return (
    <div className="league-detail-container">
      <div className="detail-header-row">
        <button className="back-leagues-btn" onClick={onBack}>
          &larr; All Leagues
        </button>
        <h2>League Management - {league.league_name}</h2>
      </div>

      <p className="league-id">League ID: {league.league_id}</p>
      <p>
        <strong>Members:</strong> {league.members.length} / 8
      </p>

      <ul className="user-list">
        {league.members.map((u) => (
          <li
            key={u.user_id}
            className={
              u.user_id === Number(user.userId) ? "highlighted-user" : ""
            }
          >
            {u.username || `User ${u.user_id}`} —{" "}
            <strong>{u.total_score} pts</strong>
          </li>
        ))}
      </ul>

      {/* Show a Quit League button if the user is in the league */}
      {isUserInLeague && (
        <button
          className="quit-league-btn"
          onClick={() => onQuit(league.league_id)}
        >
          Quit League
        </button>
      )}
      {/* 💬 League Chat */}
      <LeagueChat selectedLeague={league.league_id} user={user} />

    </div>
  );
}
