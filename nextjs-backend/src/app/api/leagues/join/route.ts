import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function PUT(req: Request) {
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

    // ✅ Check if league exists before allowing the user to join
    const [leagueExists] = await connection.execute<RowDataPacket[]>(
      `SELECT * FROM leagues WHERE id = ?`,
      [leagueId]
    );

    if (leagueExists.length === 0) {
      connection.release();
      return NextResponse.json({ error: "League does not exist." }, { status: 404 });
    }

    // ✅ Insert user into league (or ignore if already in)
    await connection.execute(
      `INSERT INTO user_leagues (user_id, league_id) VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE league_id = VALUES(league_id)`,
      [userId, leagueId]
    );

    connection.release();
    return NextResponse.json({ message: "✅ User joined the league!" });
  } catch (error) {
    console.error("❌ Error joining league:", error);
    return NextResponse.json({ error: "Failed to join league" }, { status: 500 });
  }
}
