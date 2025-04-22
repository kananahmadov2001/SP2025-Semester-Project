// nextjs-backend/src/app/api/challenge/[id]/downvote/route.ts
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
            `UPDATE player_clips SET thumbs_down = thumbs_down + 1 WHERE id = ?`,
            [clipId]
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(`❌ Downvote clip ${clipId} error:`, err);
        return NextResponse.json({ error: "Failed to downvote" }, { status: 500 });
    } finally {
        connection.release();
    }
}
