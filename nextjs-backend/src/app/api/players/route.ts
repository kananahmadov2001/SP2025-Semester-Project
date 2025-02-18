import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const playerId = url.searchParams.get("id");
    const team = url.searchParams.get("team");
    const name = url.searchParams.get("name");

    let query = "SELECT id, firstname, lastname, position, teamid, team FROM players";
    const queryParams: any[] = [];
    const conditions: string[] = [];

    // Add filters dynamically
    if (playerId) {
      conditions.push("id = ?");
      queryParams.push(playerId);
    }
    if (team) {
      conditions.push("team = ?");
      queryParams.push(team);
    }
    if (name) {
      conditions.push("(firstname LIKE ? OR lastname LIKE ?)");
      queryParams.push(`%${name}%`, `%${name}%`);
    }

    // Append WHERE clause dynamically
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY firstname ASC"; // Sort by first name

    const connection = await pool.getConnection();
    const [players] = await connection.execute<RowDataPacket[]>(query, queryParams);
    connection.release();

    return NextResponse.json({ players });
  } catch (error) {
    console.error("❌ Error fetching players:", error);
    return NextResponse.json({ error: "Failed to retrieve player data" }, { status: 500 });
  }
}
