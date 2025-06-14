// src/api/action/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ActionType } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const AUTH_COOKIE = "token";
const JWT_SECRET = process.env.JWT_SECRET!;

// Helper: استخراج userId از JWT
function getUserIdFromToken(token: string): string | null {
  try {
    // با توجه به ساختار توکن که userId هست
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // --- خواندن پارامترها از بادی
  const { contentId, type } = await req.json();

  // --- چک کردن معتبر بودن پارامترها
  if (
    !contentId ||
    !type ||
    !Object.values(ActionType).includes(type as ActionType)
  ) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  // --- خواندن و وریفای توکن
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const userId = token ? getUserIdFromToken(token) : null;

  if (!userId) {
    return NextResponse.json(
      { error: "You need to be logged in." },
      { status: 401 },
    );
  }

  // --- toggle رفتار
  try {
    const exists = await prisma.userContentAction.findUnique({
      where: {
        userId_contentId_type: {
          userId,
          contentId,
          type: type as ActionType,
        },
      },
    });

    if (exists) {
      // حذف اکشن (غیرفعال کردن)
      await prisma.userContentAction.delete({
        where: {
          userId_contentId_type: {
            userId,
            contentId,
            type: type as ActionType,
          },
        },
      });
      return NextResponse.json({ status: "removed" });
    } else {
      // ثبت اکشن (فعال کردن)
      await prisma.userContentAction.create({
        data: {
          userId,
          contentId,
          type: type as ActionType,
        },
      });
      return NextResponse.json({ status: "added" });
    }
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contentId = searchParams.get("contentId");

  // توکن و userId
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const userId = token ? getUserIdFromToken(token) : null;

  if (!contentId) {
    return NextResponse.json({ error: "Missing contentId" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json(
      { bookmark: false, inspired: false, thanks: false },
      { status: 200 },
    );
  }

  // همه اکشن‌های این کاربر روی این content
  const actions = await prisma.userContentAction.findMany({
    where: {
      userId,
      contentId,
    },
  });

  // جواب خروجی (true/false برای هر اکشن)
  return NextResponse.json({
    bookmark: actions.some((a) => a.type === "BOOKMARK"),
    inspired: actions.some((a) => a.type === "INSPIRED"),
    thanks: actions.some((a) => a.type === "THANKS"),
  });
}
