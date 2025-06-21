// src/app/api/curations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { curationCreateSchema } from "@/lib/validations/curation";

// Create curation: POST /api/curations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("SERVER RECEIVED BODY:", body);

    const parse = curationCreateSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { contentId, comment, userId } = parse.data;

    // No need to find or create Content! You already have contentId.
    const curation = await prisma.curation.create({
      data: {
        userId,
        contentId,
        comment,
      },
    });

    return NextResponse.json(curation, { status: 201 });
  } catch (error) {
    console.error("Error creating curation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Search content: GET /api/curations?type={type}&title={title}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const contentId = searchParams.get("contentId");
  const categoryId = searchParams.get("categoryId");
  const title = searchParams.get("title") ?? "";

  // حالت duplication check
  if (userId && contentId) {
    const curations = await prisma.curation.findMany({
      where: { userId, contentId },
    });
    return NextResponse.json(curations);
  }

  // حالت سرچ محتوا
  if (categoryId) {
    const contents = await prisma.content.findMany({
      where: {
        categoryId,
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
      },
    });
    return NextResponse.json(contents);
  }

  const where: Prisma.CurationWhereInput = {};
  if (userId) {
    where.userId = userId;
  }

  // اگر هیچ پارامتری نبود، همه کیوریشن‌ها را برگردون
  const curations = await prisma.curation.findMany({
    where,
    include: {
      content: true,
      user: {
        select: {
          id: true,
          email: true,
          fullname: true,
          role: true,
        },
      },
    },
  });
  return NextResponse.json(curations);
}
