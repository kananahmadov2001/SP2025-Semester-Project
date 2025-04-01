// nextjs-backend/src/app/api/fantasy/add/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function POST(req: Request) {
  try {
    const { userId, playerId } = await req.json();

    if (!userId || !playerId) {
      return NextResponse.json({ error: "User ID and Player ID are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // Check if player is already in the user's team to avoid duplicates
    const [existingEntry] = await connection.execute(
      `SELECT * FROM fantasy_teams WHERE user_id = ? AND player_id = ?`,
      [userId, playerId]
    );

    if ((existingEntry as any[]).length > 0) {
      connection.release();
      return NextResponse.json({ error: "Player is already in the fantasy team" }, { status: 409 });
    }

    // Insert the player into the fantasy team
    await connection.execute(
      `INSERT INTO fantasy_teams (user_id, player_id) VALUES (?, ?)`,
      [userId, playerId]
    );

    connection.release();

    return NextResponse.json({ message: "Player added to fantasy team!", playerId: playerId });

  } catch (error) {
    console.error("❌ Error adding player to fantasy team:", error);
    return NextResponse.json({ error: "Failed to add player" }, { status: 500 });
  }
}
