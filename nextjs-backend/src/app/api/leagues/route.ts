// nextjs-backend/src/app/api/leagues/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

// 🎯 API to get all leagues OR fetch users in a league
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const leagueId = url.searchParams.get("leagueId");

    const connection = await pool.getConnection();
    let results: RowDataPacket[];

    if (leagueId) {
      // ✅ Fetch users in a specific league
      [results] = await connection.execute<RowDataPacket[]>(
        `SELECT u.id AS user_id, u.name AS username
         FROM user_leagues ul
         JOIN users u ON ul.user_id = u.id
         WHERE ul.league_id = ?`,
        [leagueId]
      );

      if (results.length === 0) {
        return NextResponse.json({ error: "No users found in this league." }, { status: 404 });
      }

      connection.release();
      return NextResponse.json({ league_members: results });
    } else {
      // ✅ Fetch all leagues
      [results] = await connection.execute<RowDataPacket[]>(
        `SELECT id AS league_id, league_name FROM leagues`
      );

      connection.release();
      return NextResponse.json({ leagues: results });
    }
  } catch (error) {
    console.error("❌ Error fetching leagues:", error);
    return NextResponse.json({ error: "Failed to retrieve leagues" }, { status: 500 });
  }
}
