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

    // Check total number of players
    const [playerCountRows]: any = await connection.execute(
      `SELECT COUNT(*) AS count FROM user_team_players WHERE user_id = ?`,
      [userId]
    );
    const totalCount = playerCountRows[0].count;
    if (totalCount >= 10) {
      connection.release();
      return NextResponse.json({ error: "Team is full (max 10 players)" }, { status: 400 });
    }

    // Check for duplicates
    const [existingEntry]: any = await connection.execute(
      `SELECT * FROM user_team_players WHERE user_id = ? AND player_id = ?`,
      [userId, playerId]
    );
    if (existingEntry.length > 0) {
      connection.release();
      return NextResponse.json({ error: "Player already in team" }, { status: 409 });
    }

    // Check number of current starters
    const [starterCountRows]: any = await connection.execute(
      `SELECT COUNT(*) AS starters FROM user_team_players WHERE user_id = ? AND is_starter = TRUE`,
      [userId]
    );
    const starterCount = starterCountRows[0].starters;
    const isStarter = starterCount < 5;

    // Insert player
    await connection.execute(
      `INSERT INTO user_team_players (user_id, player_id, is_starter) VALUES (?, ?, ?)`,
      [userId, playerId, isStarter]
    );

    connection.release();
    return NextResponse.json({ message: "Player added!", playerId });

  } catch (error) {
    console.error("❌ Error adding player:", error);
    return NextResponse.json({ error: "Failed to add player" }, { status: 500 });
  }
}
