// src/app/api/[category]/[slug]/route.ts
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get a single content: GET /api/:category/:slug
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ category: string; slug: string }> },
) {
  const { category, slug } = await context.params;

  try {
    const categoryRecord = await prisma.category.findUnique({
      where: { value: category },
      select: { id: true },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 },
      );
    }

    const content = await prisma.content.findUnique({
      where: {
        slug_categoryId: {
          slug,
          categoryId: categoryRecord.id,
        },
      },
      include: {
        curations: {
          include: {
            user: {
              select: {
                fullname: true,
                avatar: true,
              },
            },
          },
        },
        category: true,
        contentTags: {
          select: {
            tag: true,
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Content not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(content);
  } catch (err) {
    return handleApiError(err);
  }
}
