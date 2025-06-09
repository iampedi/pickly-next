// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password, fullname } = await req.json();

  if (!fullname || !email || !password) {
    return NextResponse.json(
      { error: "FullName, Email and password required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullname,
    },
  });

  return NextResponse.json({
    message: "User registered!",
    user: { id: user.id, email: user.email, fullname: user.fullname },
  });
}
