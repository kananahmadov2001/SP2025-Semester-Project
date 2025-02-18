// src/app/api/fantasy/team/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    
    // Get all players added by this user
    const [fantasyTeam] = await connection.execute(
      `SELECT p.id, p.firstname, p.lastname, p.position, p.team, p.teamid 
       FROM fantasy_teams ft
       JOIN players p ON ft.player_id = p.id
       WHERE ft.user_id = ?`,
      [userId]
    );

    connection.release();
    return NextResponse.json({ fantasyTeam });
  } catch (error) {
    console.error("❌ Error fetching fantasy team:", error);
    return NextResponse.json({ error: "Failed to fetch fantasy team" }, { status: 500 });
  }
}
