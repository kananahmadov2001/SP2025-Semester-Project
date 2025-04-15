import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Log request to confirm middleware is triggered
export function middleware(req: NextRequest) {

    const res = NextResponse.next();

    // Dynamically set the CORS origin header based on the request's origin
    const allowedOrigin = 'http://localhost:5173'; // or use a dynamic approach for production environments

    res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");

    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
        return new NextResponse(null, { status: 204, headers: res.headers });
    }

    return res;
}

// Apply middleware to all API routes
export const config = {
    matcher: '/api/:path*',
};
