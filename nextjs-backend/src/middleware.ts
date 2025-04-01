// nextjs-backend/src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 1. Intercept OPTIONS requests (the preflight)
    if (request.method === "OPTIONS") {
        // Return a 200 with the necessary CORS headers, body can be empty
        const preflightResponse = new NextResponse(null, { status: 200 });

        preflightResponse.headers.set(
            "Access-Control-Allow-Origin",
            "http://localhost:5173"
        );
        preflightResponse.headers.set("Access-Control-Allow-Credentials", "true");
        preflightResponse.headers.set(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,DELETE,OPTIONS"
        );
        preflightResponse.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return preflightResponse;
    }

    // 2. For the actual request methods, proceed but also attach CORS
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );
    response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    return response;
}

// Apply only to /api routes
export const config = {
    matcher: ["/api/:path*"],
};