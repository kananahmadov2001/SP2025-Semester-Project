import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const leagueId = url.searchParams.get("leagueId");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = 10; // Show 10 users per page
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id AS user_id, u.username, SUM(fs.weekly_score) AS total_score
      FROM fantasy_teams ft
      JOIN fantasy_scores fs ON ft.player_id = fs.player_id
      JOIN users u ON ft.user_id = u.id
      GROUP BY u.id
      ORDER BY total_score DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams: any[] = [limit, offset];

    if (leagueId) {
      query = `
        SELECT u.id AS user_id, u.username, SUM(fs.weekly_score) AS league_score
        FROM fantasy_teams ft
        JOIN fantasy_scores fs ON ft.player_id = fs.player_id
        JOIN users u ON ft.user_id = u.id
        JOIN user_leagues ul ON u.id = ul.user_id
        WHERE ul.league_id = ?
        GROUP BY u.id
        ORDER BY league_score DESC
        LIMIT ? OFFSET ?
      `;
      queryParams.unshift(leagueId);
    }

    const connection = await pool.getConnection();

    // ✅ Fetch paginated leaderboard data
    const [results] = await connection.execute<RowDataPacket[]>(query, queryParams);

    // ✅ Fetch total user count for pagination metadata
    const [totalRows] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(DISTINCT ft.user_id) AS total FROM fantasy_teams ft
      JOIN fantasy_scores fs ON ft.player_id = fs.player_id
    `);
    const totalUsers = totalRows[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    connection.release();

    return NextResponse.json({
      leaderboard: results,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to retrieve leaderboard" }, { status: 500 });
  }
}
