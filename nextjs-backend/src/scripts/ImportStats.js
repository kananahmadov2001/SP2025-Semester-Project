const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const https = require("https");


dotenv.config({ path: ".env.local" });

console.log("🛠️ API_KEY Loaded:", process.env.API_KEY ? "✅ YES" : "❌ NO");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Maximum connections to prevent overload
  queueLimit: 0,
});


// Function to fetch latest game data
const fetchGameData = () => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];

  const options = {
    method: "GET",
    hostname: "api-nba-v1.p.rapidapi.com",
    port: null,
    path: `/games?${formattedDate}`, // Adjust this date dynamically
    headers: {
      "x-rapidapi-key": process.env.API_KEY,
      "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    },
  };

  const req = https.request(options, (res) => {
    const chunks = [];

    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", async () => {
      const body = Buffer.concat(chunks);
      const jsonResponse = JSON.parse(body.toString());
      const games = jsonResponse.response;

      if (!games || games.length === 0) {
        console.log("No games found for the date.");
        return;
      }

      const gameIds = games.map((game) => game.id);

      for (const gameId of gameIds) {
        await fetchGameStatistics(gameId);
      }
    });
  });

  req.on("error", (error) => {
    console.error("Error fetching game data:", error);
  });

  req.end();
};

// Function to fetch game statistics for each game
const fetchGameStatistics = (gameId) => {
  const options = {
    method: "GET",
    hostname: "api-nba-v1.p.rapidapi.com",
    port: null,
    path: `/players/statistics?game=${gameId}`,
    headers: {
      "x-rapidapi-key": process.env.API_KEY,
      "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    },
  };

  const req = https.request(options, (res) => {
    const chunks = [];

    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", async () => {
      const body = Buffer.concat(chunks);
      const jsonResponse = JSON.parse(body.toString());
      const playersStatistics = jsonResponse.response;

      if (!playersStatistics || playersStatistics.length === 0) {
        console.log(`⚠️ No statistics found for game ${gameId}`);
        return;
      }

      const connection = await pool.getConnection();

      try {
        for (const stats of playersStatistics) {
          const playerId = stats.player.id;
          const gameDate = new Date().toISOString().split("T")[0];

          // ✅ Check if player exists in `players` table
          const [playerExists] = await connection.execute(
            "SELECT id FROM players WHERE id = ?",
            [playerId]
          );

          if (playerExists.length === 0) {
            console.warn(`⚠️ Skipping player ${playerId} - Not found in players table.`);
            continue; // Skip inserting stats for this player
          }

          // Extract stats, defaulting to 0 if undefined
          const turnovers = stats.turnovers || 0;
          const personalFouls = stats.pFouls || 0;
          const fga = stats.fga || 0;
          const fgm = stats.fgm || 0;
          const fta = stats.fta || 0;
          const ftm = stats.ftm || 0;
          const tpa = stats.tpa || 0;
          const tpm = stats.tpm || 0;
          const blocks = stats.blocks || 0;
          const steals = stats.steals || 0;
          const plusMinus = stats.plusMinus ? parseInt(stats.plusMinus, 10) : 0;

          // ✅ Fantasy Score Calculation (BAD stats = HIGHER score)
          const missedFG = fga - fgm;
          const missedFT = fta - ftm;
          const missed3P = tpa - tpm;
          const plusMinusPenalty = Math.floor(plusMinus / 5);

          const fantasyScore =
            2 * turnovers +
            1 * personalFouls +
            2 * missedFG +
            1 * missedFT +
            3 * missed3P +
            -2 * blocks +
            -1 * steals +
            plusMinusPenalty;

          // ✅ Get the latest cumulative score (Ensure it always defaults to 0)
          const [latestScoreResult] = await connection.execute(
            `SELECT cumulative_score FROM fantasy_scores WHERE player_id = ? ORDER BY game_date DESC LIMIT 1`,
            [playerId]
          );

          const latestCumulativeScore = latestScoreResult.length > 0 ? latestScoreResult[0].cumulative_score || 0 : 0;

          // ✅ Insert or update the fantasy_scores table
          await connection.execute(
            `INSERT INTO fantasy_scores (
                player_id, game_date, turnovers, personal_fouls, 
                field_goals_attempted, field_goals_made, free_throws_attempted, 
                free_throws_made, three_pointers_attempted, three_pointers_made, 
                blocks, steals, plus_minus, weekly_score, cumulative_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                turnovers = VALUES(turnovers), personal_fouls = VALUES(personal_fouls),
                field_goals_attempted = VALUES(field_goals_attempted), field_goals_made = VALUES(field_goals_made),
                free_throws_attempted = VALUES(free_throws_attempted), free_throws_made = VALUES(free_throws_made),
                three_pointers_attempted = VALUES(three_pointers_attempted), three_pointers_made = VALUES(three_pointers_made),
                blocks = VALUES(blocks), steals = VALUES(steals), plus_minus = VALUES(plus_minus),
                weekly_score = VALUES(weekly_score),
                cumulative_score = VALUES(cumulative_score) + VALUES(weekly_score)`,
            [
              playerId, gameDate, turnovers, personalFouls, fga, fgm, fta, ftm, tpa, tpm,
              blocks, steals, plusMinus, fantasyScore,
              latestCumulativeScore + fantasyScore
            ]
          );
        }

        console.log(`✅ Stats updated for game ${gameId}`);
      } catch (error) {
        console.error(`❌ Error updating stats for player ${playerId} in game ${gameId}:`, error);
      } finally {
        connection.release();
      }
    });
  });

  req.on("error", (error) => {
    console.error(`Error fetching statistics for game ${gameId}:`, error);
  });

  req.end();
};



// Start Fetching Game Data
fetchGameData();
