import "./HomePage.css";

function StatsDashboard() {
  // Sample data
  const leaderboard = [
    { rank: 1, user: "HaterKing23", points: 1825 },
    { rank: 2, user: "FlopSquadGOAT", points: 1740 },
    { rank: 3, user: "MissedShotsOnly", points: 1625 },
    { rank: 4, user: "TurnoverTyrant", points: 1570 },
    { rank: 5, user: "BenchedAllGame", points: 1500 },
  ];

  // Sample data
  const playerStats = [
    { name: "Russell Westbrook", turnovers: 7, missedShots: 12, fouls: 4, points: 50 },
    { name: "Dillon Brooks", turnovers: 6, missedShots: 10, fouls: 5, points: 48 },
    { name: "Draymond Green", turnovers: 5, missedShots: 9, fouls: 6, points: 45 },
    { name: "Jordan Poole", turnovers: 4, missedShots: 11, fouls: 3, points: 42 },
    { name: "Ben Simmons", turnovers: 3, missedShots: 8, fouls: 5, points: 40 },
  ];

  return (
    <section className="stats-dashboard">
      {/* Leaderboard Section */}
      <div className="leaderboard-container">
        <h3>Hater Fantasy Leaderboard</h3>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.rank}>
                <td>#{entry.rank}</td>
                <td>{entry.user}</td>
                <td>{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Player Stats Table */}
      <div className="player-stats-container">
        <h3>Top Underperforming Players</h3>
        <table className="player-stats-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Turnovers</th>
              <th>Missed Shots</th>
              <th>Fouls</th>
              <th>HFL Points</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((player, index) => (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{player.turnovers}</td>
                <td>{player.missedShots}</td>
                <td>{player.fouls}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StatsDashboard;
