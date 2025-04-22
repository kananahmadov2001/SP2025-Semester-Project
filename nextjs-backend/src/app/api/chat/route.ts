import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import { RowDataPacket } from "mysql2";

// Fetch latest 100 messages
export async function GET(req: NextRequest) {
  try {
    const leagueId = req.nextUrl.searchParams.get("leagueId");

    const connection = await pool.getConnection();
    const query = leagueId
      ? "SELECT id, user_name AS user, text, created_at FROM chat_messages WHERE league_id = ? ORDER BY created_at DESC LIMIT 100"
      : "SELECT id, user_name AS user, text, created_at FROM chat_messages WHERE league_id IS NULL ORDER BY created_at DESC LIMIT 100";

    const [rows] = await connection.execute<RowDataPacket[]>(query, leagueId ? [leagueId] : []);
    connection.release();

    // Reverse so newest is last (normal chat order)
    return NextResponse.json({ messages: rows.reverse() });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

// Save new message and enforce 100 message limit
export async function POST(req: NextRequest) {
    console.log("hi");
  try {
    const { user, text, leagueId } = await req.json();

    const connection = await pool.getConnection();

    await connection.execute(
      `INSERT INTO chat_messages (user_name, text, league_id) VALUES (?, ?, ?)`,
      [user, text, leagueId || null]
    );

    // Enforce 100 message limit per chat
    const deleteQuery = leagueId
      ? `
        DELETE FROM chat_messages 
        WHERE league_id = ? 
        AND id NOT IN (
          SELECT id FROM (
            SELECT id FROM chat_messages 
            WHERE league_id = ? 
            ORDER BY created_at DESC 
            LIMIT 100
          ) AS subquery
        )`
      : `
        DELETE FROM chat_messages 
        WHERE league_id IS NULL 
        AND id NOT IN (
          SELECT id FROM (
            SELECT id FROM chat_messages 
            WHERE league_id IS NULL 
            ORDER BY created_at DESC 
            LIMIT 100
          ) AS subquery
        )`;

    await connection.execute(deleteQuery, leagueId ? [leagueId, leagueId] : []);

    connection.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}
