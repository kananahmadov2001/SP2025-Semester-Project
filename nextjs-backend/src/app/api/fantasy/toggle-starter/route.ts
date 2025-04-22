import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function PUT(req: Request) {
  try {
    const { userId, playerId } = await req.json();

    if (!userId || !playerId) {
      return NextResponse.json({ error: "User ID and Player ID are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // Get current player status
    const [rows]: any = await connection.execute(
      `SELECT is_starter FROM user_team_players WHERE user_id = ? AND player_id = ?`,
      [userId, playerId]
    );

    if (rows.length === 0) {
      connection.release();
      return NextResponse.json({ error: "Player not found on team" }, { status: 404 });
    }

    const currentStatus = rows[0].is_starter;

    if (currentStatus) {
      // Toggle to bench
      await connection.execute(
        `UPDATE user_team_players SET is_starter = FALSE, position = NULL WHERE user_id = ? AND player_id = ?`,
        [userId, playerId]
      );
    } else {
      // Count current starters
      const [countRows]: any = await connection.execute(
        `SELECT COUNT(*) AS starterCount FROM user_team_players WHERE user_id = ? AND is_starter = TRUE`,
        [userId]
      );
      const starterCount = countRows[0].starterCount;

      if (starterCount >= 5) {
        connection.release();
        return NextResponse.json({ error: "Max number of starters (5) reached" }, { status: 400 });
      }

      // Get next available position
      const [posRows]: any = await connection.execute(
        `SELECT MAX(position) AS maxPos FROM user_team_players WHERE user_id = ? AND is_starter = TRUE`,
        [userId]
      );
      const nextPos = (posRows[0].maxPos || 0) + 1;

      // Toggle to starter
      await connection.execute(
        `UPDATE user_team_players SET is_starter = TRUE, position = ? WHERE user_id = ? AND player_id = ?`,
        [nextPos, userId, playerId]
      );
    }

    connection.release();
    return NextResponse.json({ message: "Starter status toggled!" });

  } catch (error) {
    console.error("❌ Error toggling starter:", error);
    return NextResponse.json({ error: "Failed to toggle starter" }, { status: 500 });
  }
}
