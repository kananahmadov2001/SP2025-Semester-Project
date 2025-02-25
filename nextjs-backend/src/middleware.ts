// nextjs-backend/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 1. If it's an OPTIONS request, short-circuit with the CORS headers
    if (request.method === "OPTIONS") {
        const response = new NextResponse(null, { status: 200 });
        response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return response;
    }

    // 2. Otherwise, proceed normally but also set CORS on the actual response
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

export const config = {
    matcher: ["/api/:path*"],
};
