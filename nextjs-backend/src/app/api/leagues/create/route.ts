// nextjs-backend/src/app/api/leagues/create/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

/**
 * POST /api/leagues/create
 * Expects: { leagueName: string, userId: number }
 *  1) Create a new league with that name.
 *  2) Automatically add the user (creator) to user_leagues.
 * Returns: { message: string, leagueID: number }
 */
export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { leagueName, userId } = body;

    // Existing validation for leagueName
    if (!leagueName || typeof leagueName !== "string") {
      return NextResponse.json(
        { error: "League name is required and must be a string" },
        { status: 400 }
      );
    }

    // Ensure userId is provided and is a valid number
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Create the league
      const [result]: any = await connection.execute(
        `INSERT INTO leagues (league_name) VALUES (?)`,
        [leagueName]
      );

      // The newly inserted league ID
      const leagueID = result.insertId;

      // Insert the creator into user_leagues so they automatically join
      await connection.execute(
        `INSERT INTO user_leagues (user_id, league_id) VALUES (?, ?)`,
        [userId, leagueID]
      );

      return NextResponse.json({
        message: "✅ League created successfully!",
        leagueID: leagueID,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error creating league:", error);
    return NextResponse.json({ error: "Failed to create league" }, { status: 500 });
  }
}
