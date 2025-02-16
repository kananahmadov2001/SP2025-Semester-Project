import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function POST(req: Request) {
  try {
    const { userId, playerId } = await req.json();

    if (!userId || !playerId) {
      return NextResponse.json({ error: "User ID and Player ID are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // Check if player already exists in the user's fantasy team
    const [existingEntry]: any = await connection.execute(
      "SELECT * FROM fantasy_teams WHERE user_id = ? AND player_id = ?",
      [userId, playerId]
    );

    if (existingEntry.length > 0) {
      connection.release();
      return NextResponse.json({ error: "Player already in team" }, { status: 400 });
    }

    // Add player to user's fantasy team
    await connection.execute(
      "INSERT INTO fantasy_teams (user_id, player_id) VALUES (?, ?)",
      [userId, playerId]
    );

    connection.release();
    return NextResponse.json({ message: "Player added to fantasy team!" }, { status: 201 });
  } catch (error) {
    console.error("Error adding player to fantasy team:", error);
    return NextResponse.json({ error: "Failed to add player" }, { status: 500 });
  }
}
