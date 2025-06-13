// src/lib/auth/withAuth.ts
import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "../errors";
import { JwtPayload, verifyJwt } from "./jwt";

export function withAuth(
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse>,
) {
  return async function (req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
      throw new UnauthorizedError("Invalid token");
    }

    return handler(req, payload);
  };
}
