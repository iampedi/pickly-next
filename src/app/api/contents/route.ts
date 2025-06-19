// src/app/api/contents/route.ts
import { prisma } from "@/lib/prisma";
import { ContentSchema, contentSchema } from "@/lib/validations/content";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

function formatZodError(error: ZodError) {
  return error.flatten().fieldErrors;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // اعتبارسنجی با Zod
    const parsed = contentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: formatZodError(parsed.error),
        },
        { status: 400 },
      );
    }

    // تایپ دقیق برای tags
    const { tags, ...rest } = parsed.data as ContentSchema;
    const contentData: Omit<ContentSchema, "tags"> = rest;

    // بررسی یکتا بودن عنوان و دسته
    const existing = await prisma.content.findUnique({
      where: {
        title_categoryId: {
          title: contentData.title,
          categoryId: contentData.categoryId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Content with this title and category already exists." },
        { status: 400 },
      );
    }

    // دسته‌بندی تگ‌ها: موجود و جدید
    const existingTags = (tags ?? []).filter((tag) => tag.id);
    const newTags = (tags ?? []).filter((tag) => !tag.id);

    const normalizedNewTags = newTags.map((tag) => ({
      ...tag,
      name: tag.name.trim().toLowerCase(),
    }));

    // ساخت یا یافتن تگ‌های جدید (یادداشت: جلوگیری از ساخت تگ تکراری)
    const createdTags = await Promise.all(
      normalizedNewTags.map(async (tag) => {
        const found = await prisma.tag.findUnique({
          where: { name: tag.name },
        });
        if (found) return found;
        return prisma.tag.create({ data: { name: tag.name } });
      }),
    );

    // جمع همه id تگ‌ها
    const allTagIds: string[] = [
      ...existingTags.map((tag) => tag.id!),
      ...createdTags.map((tag) => tag.id),
    ];

    // ساخت Content و اتصال تگ‌ها
    const content = await prisma.content.create({
      data: {
        ...contentData,
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

// Read contents: GET /api/contents
export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      include: {
        curations: true,
        contentTags: { include: { tag: true } },
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
