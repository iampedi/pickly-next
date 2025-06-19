// src/app/api/auth/me/route.ts
import { verifyJwt } from "@/lib/auth/jwt";
import { UnauthorizedError } from "@/lib/errors";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      throw new UnauthorizedError("Token missing");
    }

    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        fullname: true,
        username: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}
