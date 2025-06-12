// src/app/api/contents/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: Request, context: any) {
  try {
    const { id } = context.params;
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

export async function PUT(request: Request, context: any) {
  const { id } = context.params;
  try {
    const body = await request.json();
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

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;
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
