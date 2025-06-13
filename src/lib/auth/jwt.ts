// src/lib/auth/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d"; // token expiration duration

// The shape of the data stored in the JWT
export interface JwtPayload {
  userId: string;
  email: string;
  isAdmin?: boolean;
  isCurator?: boolean;
}

// Generate a JWT token from a payload
export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Verify a JWT token and return its payload if valid
export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
