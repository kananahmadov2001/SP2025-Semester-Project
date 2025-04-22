// nextjs-backend/src/app/api/fantasy/scores/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const playerId = url.searchParams.get("playerId");
    const userId = url.searchParams.get("userId");

    let query = `
      SELECT fs.player_id, p.firstname, p.lastname, fs.game_date, 
             fs.weekly_score, fs.cumulative_score,
             fs.turnovers, fs.personal_fouls, fs.field_goals_attempted,
             fs.field_goals_made, fs.free_throws_attempted, fs.free_throws_made, 
             fs.three_pointers_attempted, fs.three_pointers_made,
             fs.blocks, fs.steals, fs.plus_minus
      FROM fantasy_scores fs
      JOIN players p ON fs.player_id = p.id`;

    const queryParams: any[] = [];

    if (playerId) {
      query += ` WHERE fs.player_id = ? ORDER BY fs.game_date DESC LIMIT 1`;
      queryParams.push(playerId);
    } else if (userId) {
      query += `
        JOIN user_team_players utp ON fs.player_id = utp.player_id
        WHERE utp.user_id = ?
        ORDER BY fs.game_date DESC`;
      queryParams.push(userId);
    } else {
      query += ` ORDER BY fs.game_date DESC`;
    }

    const connection = await pool.getConnection();
    const [results] = await connection.execute<RowDataPacket[]>(query, queryParams);
    connection.release();

    return NextResponse.json({ scores: results });
  } catch (error) {
    console.error("❌ Error fetching fantasy scores:", error);
    return NextResponse.json({ error: "Failed to retrieve scores" }, { status: 500 });
  }
}
