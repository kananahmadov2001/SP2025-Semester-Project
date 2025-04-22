import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT u.id AS user_id, u.name AS username, SUM(fs.weekly_score) AS total_score
      FROM user_team_players utp
      JOIN fantasy_scores fs ON utp.player_id = fs.player_id
      JOIN users u ON utp.user_id = u.id
      WHERE utp.is_starter = 1
      GROUP BY u.id
      ORDER BY total_score DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT utp.user_id) AS total
      FROM user_team_players utp
      JOIN fantasy_scores fs ON utp.player_id = fs.player_id
      WHERE utp.is_starter = 1
    `;

    const connection = await pool.getConnection();

    const [results] = await connection.execute<RowDataPacket[]>(query);
    const [totalRows] = await connection.execute<RowDataPacket[]>(countQuery);

    connection.release();

    const totalUsers = totalRows[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

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
