// src/app/api/contents/[id]/route.ts
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: Request, context: any) {
  try {
    const { id } = context.params;
    const content = await prisma.content.findUnique({ where: { id } });
    return NextResponse.json(content);
  } catch (err) {
    return handleApiError(err);
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
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.content.delete({ where: { id } });
    return NextResponse.json(
      { message: "Content deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
