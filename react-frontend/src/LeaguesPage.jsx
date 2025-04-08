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

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // If this is not null, we show the "LeagueDetailView" instead of the main list
  const [selectedLeague, setSelectedLeague] = useState(null);

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
      const response = await fetch(`${LEAGUES_URL}/join`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userId, leagueId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to join league.");

      setMessage("Successfully joined league!");

      // Refresh data
      await fetchAllData();
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
      await fetchAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  }

  /**
   * If user is in the league, set selectedLeague = that league to show the "LeagueDetailView"
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
        // If we have a selectedLeague, show the detail view
        <LeagueDetailView
          league={selectedLeague}
          user={user}
          onBack={() => setSelectedLeague(null)}
          onQuit={handleQuitLeague}
        />
      ) : (
        // Otherwise show the list of all leagues
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
                  className={`league-card ${isUserInLeague ? "highlight-league" : ""
                    }`}
                  // ADDED: Make the entire card clickable if user is in it
                  onClick={() => handleLeagueCardClick(league)}
                  style={{ cursor: isUserInLeague ? "pointer" : "default" }}
                >
                  <p className="league-name">
                    <strong>{league.league_name}</strong>{" "}
                    {isUserInLeague && (
                      <span className="joined-tag">[Joined]</span>
                    )}
                  </p>
                  <p className="league-id">League ID: {league.league_id}</p>

                  <p>Members: {league.members.length} / 8</p>
                  <ul className="user-list">
                    {league.members.map((u) => (
                      <li
                        key={u.user_id}
                        className={
                          u.user_id === Number(user.userId)
                            ? "highlighted-user"
                            : ""
                        }
                      >
                        {u.username || `User ${u.user_id}`} —{" "}
                        <strong>{u.total_score} pts</strong>
                      </li>
                    ))}
                  </ul>

                  {/* If not joined, show a "Join" button */}
                  {!isUserInLeague && (
                    <button
                      className="join-league-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card click
                        handleJoinLeague(league.league_id);
                      }}
                    >
                      Join League
                    </button>
                  )}

                  {/* If joined, show a "Quit" button */}
                  {isUserInLeague && (
                    <button
                      className="quit-league-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card click
                        handleQuitLeague(league.league_id);
                      }}
                    >
                      Quit League
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
 *  Displays a detailed view for a single league. This replaces the
 *  "Available Leagues" list if selectedLeague != null.
 * 
 *  * league: { league_id, league_name, members: [ {user_id, username, total_score}, ... ] }
 *  * user: the current user
 *  * onBack: function to go back to the league list
 *  * onQuit: function(leagueId) => ...
 */
function LeagueDetailView({ league, user, onBack, onQuit }) {
  const isUserInLeague = league.members.some(
    (m) => m.user_id === Number(user.userId)
  );

  return (
    <div className="league-detail-container">
      <h2>League Management - {league.league_name}</h2>
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

      {/* Back to all leagues */}
      <button className="back-leagues-btn" onClick={onBack}>
        Back to All Leagues
      </button>
    </div>
  );
}
