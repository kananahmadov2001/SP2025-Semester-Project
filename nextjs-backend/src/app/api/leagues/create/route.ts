import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { leagueName } = body;

    if (!leagueName || typeof leagueName !== "string") {
      return NextResponse.json({ error: "League name is required and must be a string" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const [result]: any = await connection.execute(
      `INSERT INTO leagues (league_name) VALUES (?)`,
      [leagueName]
    );
    connection.release();

    return NextResponse.json({
      message: "✅ League created successfully!",
      leagueID: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error creating league:", error);
    return NextResponse.json({ error: "Failed to create league" }, { status: 500 });
  }
}
