import React, { useState, useEffect } from "react";

function LeaderboardSection() {
  const [playerStats, setPlayerStats] = useState([]);

  // Fetch player stats from API
  useEffect(() => {
    async function fetchPlayerStats() {
      try {
        const response = await fetch("/api/player-stats");
        const data = await response.json();
        setPlayerStats(data.stats);
      } catch (error) {
        console.error("Error fetching player stats:", error);
      }
    }
    fetchPlayerStats();
  }, []);

  return (
    <section className="dashboard-section leaderboard-section">
      <h2 className="leaderboard-heading">Player Stats</h2>

      <div className="table-container">
        <table className="player-stats-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>PTS</th>
              <th>MIN</th>
              <th>FG%</th>
              <th>FT%</th>
              <th>REB</th>
              <th>AST</th>
              <th>STL</th>
              <th>BLK</th>
              <th>TO</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((player, index) => (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{player.points}</td>
                <td>{player.min}</td>
                <td>{((player.fgm / player.fga) * 100).toFixed(1)}%</td>
                <td>{((player.ftm / player.fta) * 100).toFixed(1)}%</td>
                <td>{player.totReb}</td>
                <td>{player.assists}</td>
                <td>{player.steals}</td>
                <td>{player.blocks}</td>
                <td>{player.turnovers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default LeaderboardSection;
