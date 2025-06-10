// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";


const JWT_SECRET = process.env.JWT_SECRET || "ilovesecret";

export function signJwt(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d", ...options });
}

export async function verifyJwt(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
  } catch {
    return null;
  }
}