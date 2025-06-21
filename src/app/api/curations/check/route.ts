// src/app/api/curations/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const categoryId = searchParams.get("categoryId");
  const title = searchParams.get("title");

  if (!categoryId || !title || !userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const existing = await prisma.curation.findFirst({
    where: {
      content: {
        title: {
          equals: title,
          mode: "insensitive",
        },
        categoryId,
      },
      userId,
    },
  });

  return NextResponse.json({ exists: !!existing });
}
