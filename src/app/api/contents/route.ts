// src/app/api/contents/route.ts
import { verifyJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { contentSchema } from "@/lib/validations/content";
import { ActionType } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

function formatZodError(error: ZodError) {
  return error.flatten().fieldErrors;
}

// Create a new content
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the input data using Zod
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

    // Normalize and deduplicate tags
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
    const slug = slugify(normalizedTitle);

    // Check if a content with the same title already exists
    const existing = await prisma.content.findUnique({
      where: {
        slug_categoryId: {
          slug,
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

    // Create content and its tags in a single transaction
    const content = await prisma.content.create({
      data: {
        title: normalizedTitle,
        slug,
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

  const token = request.cookies.get("token")?.value;
  let userId: string | null = null;

  if (token) {
    const payload = verifyJwt(token);
    if (payload?.userId) userId = payload.userId;
  }

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
        _count: { select: { curations: true } },
        contentTags: { select: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    let actionsMap: Record<string, ActionType[]> = {};

    if (userId) {
      const actions = await prisma.userContentAction.findMany({
        where: { userId },
        select: { contentId: true, type: true },
      });

      actionsMap = actions.reduce(
        (acc, action) => {
          acc[action.contentId] = acc[action.contentId] || [];
          acc[action.contentId].push(action.type);
          return acc;
        },
        {} as Record<string, ActionType[]>,
      );
    }

    const mappedContents = contents.map((item) => {
      const actionTypes = actionsMap[item.id] || [];

      return {
        ...item,
        curationsCount: item._count.curations,
        actions: {
          bookmark: actionTypes.includes("BOOKMARK"),
          inspired: actionTypes.includes("INSPIRED"),
          thanks: actionTypes.includes("THANKS"),
        },
      };
    });

    return NextResponse.json(mappedContents, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch contents:", error);
    return NextResponse.json(
      { error: "Failed to fetch contents" },
      { status: 500 },
    );
  }
}
