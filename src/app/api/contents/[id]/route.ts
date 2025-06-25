// src/app/api/contents/[id]/route.ts
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get a single content: GET /api/contents/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const content = await prisma.content.findUnique({
      where: { id: id },
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

// Update a Content: PUT /api/contents/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, categoryId, link, tags, description, image } = body;
    const normalizedTitle = title.trim().toLowerCase();

    const existing = await prisma.content.findFirst({
      where: {
        title: normalizedTitle,
        categoryId,
        NOT: { id: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A content with this title already exists in this category." },
        { status: 400 },
      );
    }

    // Update the content
    let updated;
    try {
      updated = await prisma.content.update({
        where: { id },
        data: {
          title: normalizedTitle,
          categoryId,
          link: link || "",
          image: image || "",
          description: description || "",
        },
      });
    } catch (err) {
      return handleApiError(err);
    }

    // Update tags (reset then recreate)
    if (tags && Array.isArray(tags)) {
      // Delete existing tag relations
      await prisma.contentTag.deleteMany({
        where: { contentId: id },
      });

      // Normalize and deduplicate
      const normalizedTags = Array.from(
        new Set(
          tags
            .map((t: { name: string }) => t.name.trim().toLowerCase())
            .filter(Boolean), // remove empty strings
        ),
      );

      // Create new tag relations
      for (const name of normalizedTags) {
        const tag = await prisma.tag.upsert({
          where: { name: name },
          update: {},
          create: { name: name },
        });

        await prisma.contentTag.create({
          data: {
            contentId: id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

// Delete a Content: DELETE /api/contents/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const content = await prisma.content.findUnique({ where: { id } });
    if (!content) {
      return NextResponse.json(
        { error: "Content not found." },
        { status: 404 },
      );
    }

    await prisma.$transaction([
      prisma.contentTag.deleteMany({ where: { contentId: id } }),
      prisma.curation.deleteMany({ where: { contentId: id } }),
      prisma.userContentAction.deleteMany({ where: { contentId: id } }),
      prisma.content.delete({ where: { id } }),
    ]);

    return NextResponse.json(
      { message: "Content deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
