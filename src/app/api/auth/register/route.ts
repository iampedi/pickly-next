// src/app/api/auth/register/route.ts
import { hashPassword } from "@/lib/auth/hash";
import { BadRequestError } from "@/lib/errors";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema
const registerSchema = z.object({
  fullname: z.string().min(1),
  username: z.string().min(3).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "CURATOR", "ADMIN"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError("Invalid input");
    }

    const { fullname, username, email, password, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        username: username || email,
        password: hashedPassword,
        role,
      },
    });

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
          username: user.username,
          role: user.role,
        },
      },
      { status: 201 },
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
