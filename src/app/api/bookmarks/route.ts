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
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const userId = token ? getUserIdFromToken(token) : null;

  if (!userId) {
    return NextResponse.json([], { status: 200 });
  }

  if (!userId) {
    return NextResponse.json([], { status: 200 });
  }

  const bookmarks = await prisma.userContentAction.findMany({
    where: {
      userId,
      type: "BOOKMARK",
    },
    include: { content: true },
    orderBy: { createdAt: "desc" },
  });

  const contents = bookmarks.map((b) => b.content);

  return NextResponse.json(contents);
}
