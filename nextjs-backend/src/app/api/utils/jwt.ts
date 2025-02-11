// nextjs-backend/src/app/api/utils/jwt.ts

import jwt from "jsonwebtoken";

export function signToken(payload: object): string {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in environment variables.");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// Used whenever a protected API route or page is accessed later.
export function verifyToken(token: string): any {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in environment variables.");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
}
