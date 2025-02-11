// nextjs-backend/src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // If this is a preflight request (OPTIONS), we want to respond immediately.
    if (request.method === "OPTIONS") {
        const response = NextResponse.json({}, { status: 200 });
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return response;
    }

    // For all other requests, proceed normally but set CORS headers
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
}

// Configure which paths this middleware applies to
export const config = {
    matcher: ["/api/:path*"],
};
