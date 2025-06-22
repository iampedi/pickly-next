// src/app/api/users/route.tsx
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all users: GET /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (err) {
    return handleApiError(err);
  }
}
