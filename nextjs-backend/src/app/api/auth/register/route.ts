// nextjs-backend/src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate request
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      // Check if email already exists
      const [existingUser]: any = await connection.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }

      // Insert user
      await connection.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      return NextResponse.json(
        { message: "User registered successfully!" },
        { status: 201 }
      );
    } finally {
      // Always release the connection
      connection.release();
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
