// nextjs-backend/src/app/api/auth/me/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = req.headers.get("userId");
  const userEmail = req.headers.get("userEmail");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user: { userId, email: userEmail } });
}
