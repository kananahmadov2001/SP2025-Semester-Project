import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

// 🎯 API to create a league, join a league, or fetch league members
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const leagueId = url.searchParams.get("leagueId");

    if (!leagueId) {
      return NextResponse.json({ error: "League ID is required" }, { status: 400 });
    }

    // Fetch all users in the league
    const connection = await pool.getConnection();
    const [results] = await connection.execute<RowDataPacket[]>(
      `SELECT u.id AS user_id, u.username
       FROM user_leagues ul
       JOIN users u ON ul.user_id = u.id
       WHERE ul.league_id = ?`,
      [leagueId]
    );
    connection.release();

    return NextResponse.json({ league_members: results });
  } catch (error) {
    console.error("❌ Error fetching league members:", error);
    return NextResponse.json({ error: "Failed to retrieve league members" }, { status: 500 });
  }
}

// 🎯 Create a new league
export async function POST(req: Request) {
  try {
    const { leagueName } = await req.json();
    if (!leagueName) {
      return NextResponse.json({ error: "League name is required" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO leagues (league_name) VALUES (?)`,
      [leagueName]
    );
    connection.release();

    return NextResponse.json({ message: "✅ League created successfully!" });
  } catch (error) {
    console.error("❌ Error creating league:", error);
    return NextResponse.json({ error: "Failed to create league" }, { status: 500 });
  }
}

// 🎯 Join a league
export async function PUT(req: Request) {
  try {
    const { userId, leagueId } = await req.json();
    if (!userId || !leagueId) {
      return NextResponse.json({ error: "User ID and League ID are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();
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
