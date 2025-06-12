// src/app/api/curations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
/* eslint-disable @typescript-eslint/no-explicit-any */

// GET /api/curations/:id
export async function GET(request: Request, context: any) {
  const { id } = await context.params;
  try {
    const curation = await prisma.curation.findUnique({
      where: { id },
      include: {
        content: true, // اطلاعات content را هم برگردان
      },
    });
    if (!curation) {
      return NextResponse.json(
        { error: "Curation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(curation, { status: 200 });
  } catch (error) {
    console.error("Error fetching curation:", error);
    return NextResponse.json(
      { error: "Failed to fetch curation" },
      { status: 500 },
    );
  }
}

// Update a curation: PUT /api/curations/:id
export async function PUT(request: Request, context: any) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing curation id" }, { status: 400 });
  }

  const body = await request.json();
  const { comment } = body;

  try {
    const updatedCuration = await prisma.curation.update({
      where: { id },
      data: { comment }, // فقط همین فیلد را آپدیت کن
    });
    return NextResponse.json(updatedCuration);
  } catch (error) {
    console.error("Error updating curation:", error);
    return NextResponse.json(
      { error: "Failed to update curation" },
      { status: 500 },
    );
  }
}

// Delete a curation : DELETE /api/curations/:id
export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.curation.delete({ where: { id } });
    return NextResponse.json(
      { message: "Curation deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting curation:", error);
    return NextResponse.json(
      { error: "Failed to delete curation" },
      { status: 500 },
    );
  }
}
