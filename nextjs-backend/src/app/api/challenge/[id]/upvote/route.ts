// nextjs-backend/src/app/api/challenge/[id]/upvote/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { ResultSetHeader } from "mysql2";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const clipId = Number(params.id);
    if (!clipId) {
        return NextResponse.json({ error: "Invalid clip ID" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
        await connection.execute<ResultSetHeader>(
            `UPDATE player_clips SET thumbs_up = thumbs_up + 1 WHERE id = ?`,
            [clipId]
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(`❌ Upvote clip ${clipId} error:`, err);
        return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
    } finally {
        connection.release();
    }
}
