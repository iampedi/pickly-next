// src/app/api/categories/route.ts
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { label: "asc" },
      select: {
        id: true,
        value: true,
        label: true,
        icon: true,
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}
