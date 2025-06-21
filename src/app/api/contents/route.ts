// src/app/api/contents/route.ts
import { prisma } from "@/lib/prisma";
import { contentSchema } from "@/lib/validations/content";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

function formatZodError(error: ZodError) {
  return error.flatten().fieldErrors;
}

// Create a new content
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // اعتبارسنجی با Zod
    const parsed = contentSchema.safeParse(body);
    console.log("BODY RECEIVED:", body);
    console.log("PARSED DATA:", parsed);

    if (!parsed.success) {
      console.log("ZOD ERROR:", parsed.error.flatten());
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: formatZodError(parsed.error),
        },
        { status: 400 },
      );
    }

    // نرمال‌سازی، حذف تکراری‌ها و تایپ‌گذاری دقیق
    const normalize = (name: string) => name.trim().toLowerCase();
    const rawTags = parsed.data.tags ?? [];

    const dedupedTags = Array.from(
      new Map(
        rawTags.map((tag) => [
          normalize(tag.name),
          { ...tag, name: normalize(tag.name) },
        ]),
      ).values(),
    );

    const existingTags = dedupedTags.filter((tag) => tag.id);
    const newTags = dedupedTags.filter((tag) => !tag.id);

    const createdTags = await Promise.all(
      newTags.map(async (tag) => {
        const found = await prisma.tag.findUnique({
          where: { name: tag.name },
        });
        return found ?? prisma.tag.create({ data: { name: tag.name } });
      }),
    );

    const allTagIds: string[] = [
      ...existingTags.map((tag) => tag.id!),
      ...createdTags.map((tag) => tag.id),
    ];

    const normalizedTitle = parsed.data.title.trim().toLowerCase();

    // بررسی یکتا بودن title + categoryId
    const existing = await prisma.content.findUnique({
      where: {
        title_categoryId: {
          title: normalizedTitle,
          categoryId: parsed.data.categoryId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A content with this title already exists in this category." },
        { status: 400 },
      );
    }

    // ساخت Content و اتصال به Tagها
    const content = await prisma.content.create({
      data: {
        title: normalizedTitle,
        categoryId: parsed.data.categoryId,
        link: parsed.data.link || "",
        image: parsed.data.image || "",
        description: parsed.data.description || "",
        contentTags:
          allTagIds.length > 0
            ? {
                create: allTagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
      },
      include: { contentTags: { include: { tag: true } } },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error creating content:", error);
    }
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 },
    );
  }
}

// Read contents: GET /api/contents?categoryId=xxx&title=yyy
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const title = searchParams.get("title");

  try {
    const contents = await prisma.content.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),
      },

      include: {
        category: true,
        curations: true,
        contentTags: { select: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contents, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch contents:", error);
    return NextResponse.json(
      { error: "Failed to fetch contents" },
      { status: 500 },
    );
  }
}
