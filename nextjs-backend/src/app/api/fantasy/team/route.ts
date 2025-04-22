// nextjs-backend/src/app/api/fantasy/team/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const connection = await pool.getConnection();

    const [starters] = await connection.execute(
      `SELECT p.id, p.firstname, p.lastname, p.position AS real_position, p.team, p.teamid, utp.position
       FROM user_team_players utp
       JOIN players p ON utp.player_id = p.id
       WHERE utp.user_id = ? AND utp.is_starter = TRUE
       ORDER BY utp.position ASC`,
      [userId]
    );

    const [bench] = await connection.execute(
      `SELECT p.id, p.firstname, p.lastname, p.position AS real_position, p.team, p.teamid
       FROM user_team_players utp
       JOIN players p ON utp.player_id = p.id
       WHERE utp.user_id = ? AND utp.is_starter = FALSE`,
      [userId]
    );

    connection.release();
    return NextResponse.json({ starters, bench });

  } catch (error) {
    console.error("❌ Error fetching fantasy team:", error);
    return NextResponse.json({ error: "Failed to fetch fantasy team" }, { status: 500 });
  }
}
