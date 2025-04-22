// nextjs-backend/src/app/api/challenge/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import { verifyToken } from "../utils/jwt";

type Clip = {
    id: number;
    user_id: number;
    player_id: number;
    title: string | null;
    description: string | null;
    youtube_url: string;
    thumbs_up: number;
    thumbs_down: number;
    created_at: string;
    user_name: string;
};

/**
 * GET /api/challenge
 *   Returns all clips, joined with user name and sorted by net votes (desc).
 */
export async function GET() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(`
      SELECT 
        c.id,
        c.user_id,
        c.player_id,
        c.title,
        c.description,
        c.youtube_url,
        c.thumbs_up,
        c.thumbs_down,
        c.created_at,
        u.name AS user_name
      FROM player_clips c
      JOIN users u ON c.user_id = u.id
      ORDER BY (c.thumbs_up - c.thumbs_down) DESC, c.created_at DESC
    `);
        return NextResponse.json({ clips: rows as Clip[] });
    } catch (err) {
        console.error("❌ GET /api/challenge error:", err);
        return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
    } finally {
        connection.release();
    }
}

/**
 * POST /api/challenge
 *   Create a new clip. Body must include userId via cookie, plus:
 *     { playerId, youtubeUrl, title?, description? }
 */
export async function POST(req: Request) {
    // 1) Authenticate via cookie (unchanged) …
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    if (!tokenCookie) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    let payload: any;
    try {
        payload = verifyToken(tokenCookie.value);
    } catch {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const userId = payload.userId;

    // 2) Read the whole JSON body *once*
    const body = await req.json();
    const { playerId, youtubeUrl, title, description } = body;

    if (!playerId || !youtubeUrl) {
        return NextResponse.json(
            { error: "playerId and youtubeUrl are required" },
            { status: 400 }
        );
    }

    // 3) Insert into DB…
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO player_clips
           (user_id, player_id, title, description, youtube_url)
         VALUES (?, ?, ?, ?, ?)`,
            [userId, playerId, title || null, description || null, youtubeUrl]
        );
        const insertedId = result.insertId;
        const [rows] = await connection.execute<RowDataPacket[]>(
            `SELECT * FROM player_clips WHERE id = ?`,
            [insertedId]
        );
        return NextResponse.json({ clip: rows[0] }, { status: 201 });
    } catch (err) {
        console.error("❌ POST /api/challenge error:", err);
        return NextResponse.json({ error: "Failed to create clip" }, { status: 500 });
    } finally {
        connection.release();
    }
}
