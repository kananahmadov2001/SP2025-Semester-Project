// react-frontend/src/LeaderboardSection.jsx

import React, { useState, useEffect } from "react";
import "./LeaderboardSection.css";
import { LEADERBOARD_URL } from "./config/constants";

// A helper to produce numeric page links, like "1 ... 3 4 5 ... 10"
function getPageNumbers(currentPage, totalPages) {
  const visibleRange = 2;
  const pages = [];

  // Always show 1
  pages.push(1);

  // "..." if far from 2
  if (currentPage - visibleRange > 2) {
    pages.push("...");
  }

  // Range around current
  for (let p = currentPage - visibleRange; p <= currentPage + visibleRange; p++) {
    if (p > 1 && p < totalPages) {
      pages.push(p);
    }
  }

  // "..." if far from last
  if (currentPage + visibleRange < totalPages - 1) {
    pages.push("...");
  }

  // Always show last if >1
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

function LeaderboardSection() {
  // States
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // On mount or whenever currentPage changes, fetch that page
  useEffect(() => {
    fetchLeaderboard(currentPage);
  }, [currentPage]);

  // Core fetch logic
  async function fetchLeaderboard(page) {
    setIsLoading(true);
    try {
      const url = `${LEADERBOARD_URL}?page=${page}`;
      const resp = await fetch(url, { credentials: "include" });
      const data = await resp.json();
      if (resp.ok && data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setCurrentPage(data.pagination.currentPage || 1);
        setTotalPages(data.pagination.totalPages || 1);
      } else {
        console.error("Error fetching leaderboard:", data.error);
        // If no data found, just set to empty
        setLeaderboard([]);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePageClick(pageNum) {
    if (pageNum === "...") return; // ignore
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  }

  // A simple direct jump input
  const [jumpPage, setJumpPage] = useState("");

  function handleJump() {
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p)) {
      setCurrentPage(p);
    }
    setJumpPage("");
  }

  return (
    <section className="leaderboard-container">
      <h2>Leaderboard</h2>

      {/* If loading, show a small spinner/message */}
      {isLoading ? (
        <div className="leaderboard-loading">Loading Leaderboard...</div>
      ) : (
        <>
          {/* If we have data, show a table or list */}
          {leaderboard.length === 0 ? (
            <p className="no-leaderboard">No leaderboard data found.</p>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, index) => {
                  const rank = (currentPage - 1) * 10 + (index + 1);
                  return (
                    <tr key={row.user_id}>
                      <td>{rank}</td>
                      <td>{row.username}</td>
                      <td>{row.total_score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="leaderboard-pagination">
              {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                if (p === "...") {
                  return (
                    <span key={`lb-ellipsis-${idx}`} className="ellipsis">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={`lb-page-${p}`}
                    className={`lb-page-btn ${p === currentPage ? "active" : ""}`}
                    onClick={() => handlePageClick(p)}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Jump to page */}
              <div className="lb-jump-to-container">
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
          )}
        </>
      )}
    </section>
  );
}

export default LeaderboardSection;
