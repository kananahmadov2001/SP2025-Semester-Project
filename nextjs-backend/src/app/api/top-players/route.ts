// nextjs-backend/src/app/api/top-players/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

export async function GET() {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.execute<RowDataPacket[]>(
            `
      SELECT 
        p.id, 
        p.firstname, 
        p.lastname, 
        p.team, 
        p.position,
        fs.weekly_score
      FROM fantasy_scores fs
      JOIN players p ON fs.player_id = p.id
      ORDER BY fs.weekly_score DESC
      LIMIT 5
      `
        );

        connection.release();

        return NextResponse.json({ players: rows });
    } catch (error) {
        console.error("❌ Error fetching top players from fantasy_scores:", error);
        return NextResponse.json({ error: "Failed to fetch top players" }, { status: 500 });
    }
}
