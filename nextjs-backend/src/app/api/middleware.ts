import { NextResponse } from "next/server";
import { verifyToken } from "@/app/api/utils/jwt";

export function middleware(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: Missing Token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Invalid Token" }, { status: 401 });
  }

  // ✅ Attach user details to request headers
  request.headers.set("userId", user.userId.toString());
  request.headers.set("userEmail", user.email);

  return NextResponse.next();
}

// ✅ Apply middleware to all `/api/protected` routes
export const config = {
  matcher: ["/api/protected/:path*"], // Adjust this to match protected routes
};
