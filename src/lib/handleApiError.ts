// src/lib/handleApiError.ts
import { NextResponse } from "next/server";
import { ApiError } from "./errors";

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }

  // Optional: log unexpected errors
  if (process.env.NODE_ENV === "development") {
    console.error("Unexpected error:", error);
  }

  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}
