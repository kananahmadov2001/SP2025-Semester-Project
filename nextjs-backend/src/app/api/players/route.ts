import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql"; // Using the same pool connection

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const playerId = url.searchParams.get("id");
    const team = url.searchParams.get("team");
    const name = url.searchParams.get("name"); // Get the name search query

    let query = "SELECT id, name, lastname, position, teamid, team, jerseyno FROM players";
    const queryParams: any[] = [];

    if (playerId) {
      query += " WHERE id = ?";
      queryParams.push(playerId);
    } else if (team) {
      query += " WHERE team = ?";
      queryParams.push(team);
    } else if (name) {
      query += " WHERE name LIKE ? OR lastname LIKE ?"; // Partial match search
      queryParams.push(`%${name}%`, `%${name}%`);
    }

    query += " ORDER BY name ASC";

    const connection = await pool.getConnection();
    const [players] = await connection.execute(query, queryParams);
    connection.release();

    return NextResponse.json({ players });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to retrieve player data" }, { status: 500 });
  }
}
