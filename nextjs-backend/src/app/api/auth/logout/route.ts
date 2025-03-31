// nextjs-backend/src/app/api/auth/logout/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // ✅ Clear the cookie
  response.cookies.set("auth_token", "", { httpOnly: true, expires: new Date(0) });

  return response;
}
