// src/app/api/auth/login/route.ts
import { comparePasswords } from "@/lib/auth/hash";
import { signJwt } from "@/lib/auth/jwt";
import { BadRequestError, UnauthorizedError } from "@/lib/errors";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError("Invalid email or password");
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const valid = await comparePasswords(password, user.password);
    if (!valid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}
