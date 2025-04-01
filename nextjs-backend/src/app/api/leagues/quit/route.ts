import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function DELETE(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { userId, leagueId } = body;

    if (!userId || !leagueId) {
      return NextResponse.json({ error: "User ID and League ID are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      `DELETE FROM user_leagues WHERE user_id = ? AND league_id = ?`,
      [userId, leagueId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({
        message: "User was not part of this league or already removed.",
      });
    }

    return NextResponse.json({
      message: "✅ User successfully left the league.",
    });
  } catch (error) {
    console.error("❌ Error quitting league:", error);
    return NextResponse.json({ error: "Failed to quit league" }, { status: 500 });
  }
}
