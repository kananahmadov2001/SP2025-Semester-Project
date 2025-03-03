import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = 10; // Show 10 users per page
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id AS user_id, u.name AS username, SUM(fs.weekly_score) AS total_score
      FROM fantasy_teams ft
      JOIN fantasy_scores fs ON ft.player_id = fs.player_id
      JOIN users u ON ft.user_id = u.id
      GROUP BY u.id
      ORDER BY total_score DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const connection = await pool.getConnection();

    // ✅ Execute query without placeholders for LIMIT & OFFSET
    const [results] = await connection.execute<RowDataPacket[]>(query);

    // ✅ Fetch total user count for pagination metadata
    const [totalRows] = await connection.execute<RowDataPacket[]>(`
      SELECT COUNT(DISTINCT ft.user_id) AS total FROM fantasy_teams ft
      JOIN fantasy_scores fs ON ft.player_id = fs.player_id
    `);
    const totalUsers = totalRows[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    connection.release();

    if (results.length === 0) {
      return NextResponse.json({ error: "No leaderboard data available." }, { status: 404 });
    }

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
