// src/app/api/contents/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get a content: GET /api/contents/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const content = await prisma.content.findUnique({ where: { id } });
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

// Update content: PUT /api/contents/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const body = await req.json();
    const { title, type, link, tags, description } = body;

    const existing = await prisma.content.findFirst({
      where: {
        title,
        type,
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A content with this title and type already exists." },
        { status: 400 },
      );
    }

    const updated = await prisma.content.update({
      where: { id },
      data: {
        title,
        type,
        link: link || "",
        tags: tags || [],
        description: description || "",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}

// Delete a content: DELETE /api/contents/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    await prisma.content.delete({ where: { id } });
    return NextResponse.json(
      { message: "Content deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 },
    );
  }
}
