// src/api/bookmarks/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const AUTH_COOKIE = "token";
const JWT_SECRET = process.env.JWT_SECRET!;

function getUserIdFromToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return payload.id;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const userId = token ? getUserIdFromToken(token) : null;

  if (!userId) {
    return NextResponse.json([], { status: 200 });
  }

  // پیدا کردن تمام بوکمارک‌های کاربر
  const bookmarks = await prisma.userContentAction.findMany({
    where: {
      userId,
      type: "BOOKMARK",
    },
    include: { content: true }, // اطلاعات کامل محتوا
    orderBy: { createdAt: "desc" },
  });

  // فقط contentها رو برگردون (یا اگر اطلاعات کامل action می‌خوای، عوضش کن)
  const contents = bookmarks.map((b) => b.content);

  return NextResponse.json(contents);
}
