// nextjs-backend/src/app/api/player-stats/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const playerId = url.searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // Fetch player stats
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT 
          player_id, firstname, lastname, points, minutes_played, 
          field_goals_made, field_goals_attempted, free_throws_made, free_throws_attempted, 
          three_pointers_made, three_pointers_attempted, offensive_rebounds, defensive_rebounds, 
          total_rebounds, assists, personal_fouls, steals, turnovers, blocks, plus_minus, num_games
       FROM player_stats 
       WHERE player_id = ?`,
      [playerId]
    );

    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: "Player stats not found" }, { status: 404 });
    }

    return NextResponse.json({ stats: rows[0] });
  } catch (error) {
    console.error("❌ Error fetching player stats:", error);
    return NextResponse.json({ error: "Failed to fetch player stats" }, { status: 500 });
  }
}
