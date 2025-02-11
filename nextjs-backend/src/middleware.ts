// nextjs-backend/src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Let Next.js process the request first.
    const response = NextResponse.next();

    // For CORS with cookies:
    response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

// Apply to all /api routes
export const config = {
    matcher: ["/api/:path*"],
};
