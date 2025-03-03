import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();
    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and new password are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    
    // ✅ Check if user exists
    const [user] = await connection.execute("SELECT id FROM users WHERE email = ?", [email]);
    if ((user as any[]).length === 0) {
      connection.release();
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = (user as any)[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update the user's password directly
    await connection.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    connection.release();
    return NextResponse.json({ message: "✅ Password reset successfully!" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
