// nextjs-backend/src/app/api/fantasy/remove/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function POST(req: Request) {
  try {
    const { userId, playerId } = await req.json();

    if (!userId || !playerId) {
      return NextResponse.json({ error: "User ID and Player ID are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // Remove the player from the user's fantasy team
    const [result]: any = await connection.execute(
      "DELETE FROM fantasy_teams WHERE user_id = ? AND player_id = ?",
      [userId, playerId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Player not found in team" }, { status: 404 });
    }

    return NextResponse.json({ message: "Player removed from fantasy team!" }, { status: 200 });
  } catch (error) {
    console.error("Error removing player from fantasy team:", error);
    return NextResponse.json({ error: "Failed to remove player" }, { status: 500 });
  }
}
