// src/app/api/contents/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Create content: POST /api/contents
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, link, tags, description } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: "Title and type are required." },
        { status: 400 },
      );
    }

    const existingContent = await prisma.content.findUnique({
      where: {
        title_type: {
          title,
          type,
        },
      },
    });

    if (existingContent) {
      return NextResponse.json(
        { error: "A content with this title and type already exists." },
        { status: 400 },
      );
    }

    const content = await prisma.content.create({
      data: {
        title,
        type,
        link: link || "",
        tags: tags || [],
        description: description || "",
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
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
