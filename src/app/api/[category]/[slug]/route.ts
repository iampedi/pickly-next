// src/app/api/[category]/[slug]/route.ts
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string; slug: string } },
) {
  const { category, slug } = params;

  try {
    const content = await prisma.content.findUnique({
      where: {
        slug_categoryId: {
          slug,
          categoryId:
            (
              await prisma.category.findUnique({
                where: { value: category },
                select: { id: true },
              })
            )?.id ?? "",
        },
      },
      include: {
        curations: true,
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
