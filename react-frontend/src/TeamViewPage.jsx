// react-frontend/src/TeamViewPage.jsx

import React, { useState, useEffect } from "react";
import "./TeamViewPage.css";
import PlayerModal from "./components/PlayerModal";
import SquadSelection from "./components/SquadSelection";
import {
  FANTASY_TEAM_URL,
  FANTASY_ADD_URL,
  FANTASY_REMOVE_URL,
  PLAYERS_URL,
  TOP_5_PLAYERS_URL
} from "./config/constants";
import { getCourtType } from "./utils/utilityFunctions";
import { UseAuth } from "./context/AuthContext";
import defaultPlayerImg from "./assets/bb-player-placeholder.jpg";
import getPlayerImage from "./getPlayerImage";

/**
 * Utility to display a numeric pagination bar:
 * We always show the first page, the last page, the current page,
 * up to 2 pages before/after the current, plus "gaps" as "..."
 */
function getPageNumbers(currentPage, totalPages) {
  const visibleRange = 2; // how many pages before/after current to show
  const pages = [];

  // Always include page 1
  pages.push(1);

  // Potential "..." if currentPage - visibleRange > 2
  if (currentPage - visibleRange > 2) {
    pages.push("...");
  }

  // Add the range [currentPage - visibleRange, currentPage + visibleRange]
  for (let p = currentPage - visibleRange; p <= currentPage + visibleRange; p++) {
    if (p > 1 && p < totalPages) {
      pages.push(p);
    }
  }

  // Potential "..." if currentPage + visibleRange < totalPages - 1
  if (currentPage + visibleRange < totalPages - 1) {
    pages.push("...");
  }

  // Always include last page if totalPages > 1
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

function DraftPlayerPage() {
  const { user } = UseAuth();

  // ------- Team Data States -------
  const [userTeam, setUserTeam] = useState([]);
  const [isFetchingTeam, setIsFetchingTeam] = useState(false);

  // ------- Players / Pagination States -------
  const [players, setPlayers] = useState([]); // The paginated or random set of players displayed
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // We maintain two states for searching:
  // 1) `searchInput` = what the user is typing in the input field
  // 2) `searchQuery` = the actual query we use to fetch data
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isFetchingPlayers, setIsFetchingPlayers] = useState(false);

  // We track if we are in "random mode" or normal pagination mode
  const [isRandomMode, setIsRandomMode] = useState(false);

  // For the single player's modal
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // For random mode, we might need to fetch "all" players once:
  const [allPlayers, setAllPlayers] = useState(null); // store after we fetch them
  const [isFetchingAllPlayers, setIsFetchingAllPlayers] = useState(false);

  const [topPlayers, setTopPlayers] = useState([]);
  const [isFetchingTopPlayers, setIsFetchingTopPlayers] = useState(false);

  // ================================ USE EFFECTS ================================
  // 1) Fetch user team whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserTeam(user.userId);
      fetchTopPlayers();
    }
  }, [user]);

  // 2) Normal usage (non-random mode): fetch players from your new endpoint
  //    whenever currentPage or searchQuery changes (but ONLY if not in random mode).
  useEffect(() => {
    if (!user) return;
    if (isRandomMode) return; // don't do normal fetch if in random mode
    fetchPagedPlayers(currentPage, searchQuery);
  }, [user, currentPage, searchQuery, isRandomMode]);

  // ================================ API CALLS ================================
  // (A) Fetch user team
  async function fetchUserTeam(userId) {
    try {
      setIsFetchingTeam(true);
      const resp = await fetch(`${FANTASY_TEAM_URL}?userId=${userId}`, {
        credentials: "include",
      });
      const data = await resp.json();
      if (resp.ok && data.fantasyTeam) {
        setUserTeam(data.fantasyTeam);
      } else {
        console.error("Error fetching user team:", data.error);
      }
    } catch (err) {
      console.error("Error fetching user team:", err);
    } finally {
      setIsFetchingTeam(false);
    }
  }

  async function fetchTopPlayers() {
    try {
      setIsFetchingTopPlayers(true);
      const resp = await fetch(TOP_5_PLAYERS_URL, { credentials: "include" });
      const data = await resp.json();
      console.log("Top players data:", data);

      if (resp.ok && data.players) {
        setTopPlayers(data.players);
      } else {
        console.error("Error fetching top players:", data.error);
      }
    } catch (err) {
      console.error("Error fetching top players:", err);
    } finally {
      setIsFetchingTopPlayers(false);
    }
  }

  // (B) Fetch players with pagination from /players?limit=10&page=...&name=...
  async function fetchPagedPlayers(pageNumber, nameQuery) {
    try {
      setIsFetchingPlayers(true);
      setIsRandomMode(false);  // ensure we are in normal mode
      // We always use limit=10 for pagination
      const params = new URLSearchParams({
        limit: "10",
        page: String(pageNumber),
      });
      if (nameQuery) {
        params.set("name", nameQuery);
      }

      const url = `${PLAYERS_URL}?${params.toString()}`;
      const resp = await fetch(url, { credentials: "include" });
      const data = await resp.json();
      if (resp.ok && data.players) {
        setPlayers(data.players); // display this page's players
        setTotalPages(data.pagination.totalPages || 1);
        setCurrentPage(data.pagination.currentPage || 1);
      } else {
        console.error("Error fetching paged players:", data.error);
      }
    } catch (err) {
      console.error("Error in fetchPagedPlayers:", err);
    } finally {
      setIsFetchingPlayers(false);
    }
  }

  // (C) Fetch all players in one go (to pick random 10 from the entire dataset)
  async function fetchAllPlayers() {
    try {
      setIsFetchingAllPlayers(true);
      // We'll do a large limit, or rely on your backend to handle no limit
      const resp = await fetch(`${PLAYERS_URL}?limit=999999&page=1`, {
        credentials: "include",
      });
      const data = await resp.json();
      if (resp.ok && data.players) {
        setAllPlayers(data.players);
      } else {
        console.error("Error fetching all players for random:", data.error);
      }
    } catch (err) {
      console.error("Error in fetchAllPlayers:", err);
    } finally {
      setIsFetchingAllPlayers(false);
    }
  }

  // ================================ HANDLERS ================================
  // 1) Pressing "Search"
  //    - set currentPage=1
  //    - update the real 'searchQuery' with the content of 'searchInput'
  //    - exit random mode
  function handleSearch() {
    setIsRandomMode(false);
    setCurrentPage(1);
    setSearchQuery(searchInput.trim()); // the effect will call fetchPagedPlayers(1, searchQuery)
  }

  // 2) Pressing "Reset" -> clear search, page=1, normal mode
  function handleReset() {
    setSearchInput("");
    setSearchQuery("");     // so we truly revert to no filter
    setIsRandomMode(false);
    setCurrentPage(1);
  }

  // 3) Jump to a page number from numeric pagination
  function goToPage(pageNum) {
    if (pageNum === "...") return; // ignore clicks on the ellipsis
    if (pageNum < 1 || pageNum > totalPages) return;
    setIsRandomMode(false);
    setCurrentPage(pageNum);
  }

  // 4) Random 10 from entire dataset
  async function handleRandom10() {
    // If we haven't fetched all players yet, do so now
    if (!allPlayers) {
      await fetchAllPlayers();
    }
    // Or if we already have them in state, skip the fetch
    if (allPlayers && allPlayers.length > 0) {
      pickRandom10FromAll(allPlayers);
    }
  }

  function pickRandom10FromAll(bigList) {
    if (!bigList || bigList.length === 0) return;
    // Shuffle bigList, slice 10
    const randomTen = [...bigList].sort(() => 0.5 - Math.random()).slice(0, 10);
    setPlayers(randomTen);
    setIsRandomMode(true);
  }

  // ============== ADD & REMOVE PLAYERS ==============
  async function handleAddPlayer(player) {
    if (!user) {
      alert("You must be logged in to add players.");
      return;
    }

    // Check front/back court
    const courtType = getCourtType(player.position);
    const isFrontCourt = courtType === "front";
    const isBackCourt = courtType === "back";

    const fcCount = userTeam.filter((p) => getCourtType(p.position) === "front").length;
    const bcCount = userTeam.filter((p) => getCourtType(p.position) === "back").length;

    if (isFrontCourt && fcCount >= 5) {
      alert("You already have 5 front-court players! Remove one first.");
      return;
    }
    if (isBackCourt && bcCount >= 5) {
      alert("You already have 5 back-court players! Remove one first.");
      return;
    }

    try {
      const response = await fetch(FANTASY_ADD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: Number(user.userId),
          playerId: player.id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add player");
      }

      alert(`Added playerId(${data.playerId}) to your team!`);
      await fetchUserTeam(user.userId); // reload user team
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function handleAdd(player) {
    handleAddPlayer(player);
    setSelectedPlayer(null);
  }

  async function handleRemovePlayer(playerId) {
    if (!user) {
      alert("You must be logged in to remove players.");
      return;
    }
    try {
      const response = await fetch(FANTASY_REMOVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: Number(user.userId),
          playerId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove player");
      }

      alert("Player removed from your team!");
      await fetchUserTeam(user.userId);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // ================================ RENDERING ================================
  // If user is null, or something weird (shouldn't happen if route is protected)
  if (!user) {
    return null; // shouldn't happen if route is protected
  }

  return (
    <div className="draftPlayer-container">
      {/*======================== CREATE/VIEW SQUAD (left side) =========================*/}
      <section className="squad-section">
        <h2>Create/View Squad</h2>
        {isFetchingTeam ? (
          <div className="team-loading">Loading your team...</div>
        ) : (
          <SquadSelection userTeam={userTeam} onRemovePlayer={handleRemovePlayer} />
        )}
      </section>

      {/*-------------- Top 5 Weekly Performers --------------*/}
      <div className="top-weekly-players">
        <h3 className="top-players-header">Top 5 Weekly Performers</h3>
        {isFetchingTopPlayers ? (
          <p className="loading-text">Loading top players...</p>
        ) : (
          <ul className="players-list">
            {topPlayers.map((player, index) => (
              <li key={player.id} className="player-item">
                <span className="rank">{index + 1}.</span>
                <span className="player-name">{player.firstname} {player.lastname}</span>
                <span className="player-score">— {player.weekly_score} pts</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*======================== DRAFT PAGE (right side) ========================*/}

      <div className="draft-page">
        <h1>Draft Your Flop Squad</h1>
        <p>Search for players or pick from the worst-performing stars of the week!</p>

        {/*-------------- Search & Pagination Controls --------------*/}
        <div className="search-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search player name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>


          {/* Random 10 from all pages */}
          <div className="random-players">
            <button className="random-btn" onClick={handleRandom10} disabled={isFetchingAllPlayers}>
              {isFetchingAllPlayers ? "Loading all players..." : "Random 10 from ALL"}
            </button>
          </div>
        </div>



        {/*-------------- If not in random mode, show pagination --------------*/}
        {!isRandomMode && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageClick={goToPage}
          />
        )}

        {/*-------------- Players List --------------*/}
        <div className="players-section">
          {isFetchingPlayers ? (
            <div className="players-loading">Loading players...</div>
          ) : (
            <div className="draft-player-card-container">
              {players.length === 0 ? (
                <p className="no-results">No players found.</p>
              ) : (
                players.map((player) => (
                  <div key={player.id} className="draft-player-card">
                    {/* Player Image */}
                    <div className="player-image-container">
                      <img src={getPlayerImage(player.team)} alt={player.firstname} className="player-card-image" />
                    </div>
                    <h3>
                      {player.firstname} {player.lastname}
                    </h3>
                    <p><strong>Team:</strong> {player.team}</p>
                    <p><strong>Position:</strong> {player.position}</p>
                    <button
                      className="draft-btn"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      Draft Player
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>


        {/*-------------- Player Modal --------------*/}
        {selectedPlayer && (
          <PlayerModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            onAdd={handleAdd}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Renders numeric pagination:
 *  - e.g. "1 ... 3 4 5 ... 10"
 */
function PaginationBar({ currentPage, totalPages, onPageClick }) {
  if (totalPages <= 1) {
    return null; // no pagination needed
  }

  const pages = getPageNumbers(currentPage, totalPages);

  // For direct-jump input
  const [jumpPage, setJumpPage] = useState("");

  function handleJump() {
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p)) {
      onPageClick(p);
    }
    setJumpPage("");
  }

  return (
    <div className="pagination-bar">
      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span key={`ellipsis-${idx}`} className="ellipsis">
              ...
            </span>
          );
        }
        return (
          <button
            key={`page-${p}`}
            className={`page-btn ${p === currentPage ? "active" : ""}`}
            onClick={() => onPageClick(p)}
          >
            {p}
          </button>
        );
      })}

      <div className="jump-to-container">
        <input
          type="number"
          placeholder="Page #"
          min={1}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
        />
        <button onClick={handleJump}>Go</button>
      </div>
    </div>
  );
}

export default DraftPlayerPage;
