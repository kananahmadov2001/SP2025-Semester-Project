import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

// Fetch latest 100 game logs
export async function GET(_req: NextRequest) {
    try {
        const connection = await pool.getConnection();

        const query = `
      SELECT 
        id, 
        game_id, 
        home_team, 
        away_team, 
        home_score, 
        away_score, 
        home_logo, 
        away_logo, 
        inserted_at 
      FROM game_logs 
      ORDER BY inserted_at DESC 
      LIMIT 100`;

        const [rows] = await connection.execute<RowDataPacket[]>(query);
        connection.release();

        return NextResponse.json({ gameLogs: rows });
    } catch (error) {
        console.error("Error fetching game logs:", error);
        return NextResponse.json({ error: "Failed to load game logs" }, { status: 500 });
    }
}

// Save new game log
export async function POST(req: NextRequest) {
    try {
        const {
            gameId,
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            homeLogo,
            awayLogo
        } = await req.json();

        const connection = await pool.getConnection();

        await connection.execute(
            `INSERT INTO game_logs 
        (game_id, home_team, away_team, home_score, away_score, home_logo, away_logo) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [gameId, homeTeam, awayTeam, homeScore, awayScore, homeLogo, awayLogo]
        );

        connection.release();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving game log:", error);
        return NextResponse.json({ error: "Failed to post game log" }, { status: 500 });
    }
}
