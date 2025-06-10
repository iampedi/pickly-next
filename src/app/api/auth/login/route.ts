// src/app/api/auth/login/route.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

console.log('JWT_SECRET in login:', process.env.JWT_SECRET);

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const payload = { id: user.id, email: user.email, isCurator: user.isCurator };
  const token = signJwt(payload);

  // اینجا response را تعریف کن
  const response = NextResponse.json({
    message: "Login successful",
    user: { id: user.id, email: user.email, fullname: user.fullname },
  });

  // حالا کوکی را ست کن
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  // فقط یک return داشته باش!
  return response;
}
