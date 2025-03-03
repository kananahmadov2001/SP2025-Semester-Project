// nextjs-backend/src/app/api/utils/jwt.ts

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const SECRET_KEY = process.env.JWT_SECRET || "TrueHaterStuff"; // Keep this secret


dotenv.config();
// ✅ Generate JWT Token
export function generateToken(payload: object) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" }); // Expires in 7 days
  }
  
  // ✅ Verify JWT Token
  export function verifyToken(token: string) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return null; // Invalid token
    }
  }