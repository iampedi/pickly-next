// src/app/api/curations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Type for expected request body
type CurationPayload = {
  type: ContentType;
  title: string;
  link?: string;
  comment?: string;
  userId: string;
};

// Create curation: POST /api/curations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, title, link, comment, userId } = body as CurationPayload;

    if (!type || !title || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Find or create content
    let content = await prisma.content.findUnique({
      where: { title_type: { title, type } },
    });

    if (!content) {
      content = await prisma.content.create({
        data: {
          title,
          type,
          link: link ?? "",
        },
      });
    }

    // Create curation
    const curation = await prisma.curation.create({
      data: {
        userId,
        contentId: content.id,
        comment,
      },
    });

    return NextResponse.json(curation, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
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
  const type = searchParams.get("type");
  const title = searchParams.get("title") ?? "";

  // حالت duplication check
  if (userId && contentId) {
    const curations = await prisma.curation.findMany({
      where: { userId, contentId },
    });
    return NextResponse.json(curations);
  }

  // حالت سرچ محتوا
  if (type) {
    const contents = await prisma.content.findMany({
      where: {
        type: type as ContentType,
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
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
