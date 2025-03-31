// nextjs-backend/src/app/api/players/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const playerId = url.searchParams.get("id");
    const team = url.searchParams.get("team");
    const name = url.searchParams.get("name");

    // ✅ Ensure `limit` and `page` are numbers
    const limit = Math.max(Number(url.searchParams.get("limit")) || 10, 1); // Default: 10 per page
    const page = Math.max(Number(url.searchParams.get("page")) || 1, 1); // Default: Page 1
    const offset = (page - 1) * limit;

    let query = `SELECT id, firstname, lastname, position, teamid, team FROM players`;
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

    // ✅ Append pagination without using placeholders for `LIMIT` and `OFFSET`
    query += ` ORDER BY firstname ASC LIMIT ${limit} OFFSET ${offset}`;

    const connection = await pool.getConnection();

    // ✅ Execute query without placeholders for LIMIT & OFFSET
    const [players] = await connection.execute<RowDataPacket[]>(query, queryParams);

    // ✅ Get total count for pagination metadata
    const [totalRows] = await connection.execute<RowDataPacket[]>(`SELECT COUNT(*) as count FROM players`);
    const totalPlayers = totalRows[0].count;
    const totalPages = Math.ceil(totalPlayers / limit);

    connection.release();

    return NextResponse.json({
      players,
      pagination: {
        totalPlayers,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching players:", error);
    return NextResponse.json({ error: "Failed to retrieve player data" }, { status: 500 });
  }
}
