// nextjs-backend/src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import pool from "@/app/api/database/mysql";
import bcrypt from "bcryptjs";
import { signToken } from "@/app/api/utils/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      // Check if user exists
      const [users]: any = await connection.execute(
        "SELECT id, name, password FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const user = users[0];

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Generate a JWT token
      const token = signToken({
        userId: user.id,
        userName: user.name,
        email: email,
      });

      // Option A: set as httpOnly cookie
      return NextResponse.json(
        { message: "Login successful!", userId: user.id, name: user.name },
        {
          status: 200,
          headers: {
            "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=86400`,
          },
        }
      );

      // Option B: Return JSON with token, not as secure as option A.
      // I'm keeping this just in case option A not working when we have a database to test with.
      // return NextResponse.json(
      //   {
      //     message: "Login successful!",
      //     token,           // your JWT
      //     userId: user.id,
      //     name: user.name,
      //   },
      //   { status: 200 }
      // );

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}