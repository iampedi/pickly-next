// src/lib/handleApiError.ts
import { NextResponse } from "next/server";
import { ApiError } from "./errors";
import { Prisma } from "@prisma/client";

export function handleApiError(error: unknown) {
  // ✅ custom app errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        type: error.constructor.name,
        status: error.statusCode,
      },
      { status: error.statusCode },
    );
  }

  // ✅ prisma constraint errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Duplicate entry.", type: "ConflictError", status: 409 },
          { status: 409 },
        );

      case "P2003":
        return NextResponse.json(
          {
            error: "Cannot delete: This item is used in another place.",
            type: "ConflictError",
            status: 409,
          },
          { status: 409 },
        );
    }
  }

  // ✅ fallback: log dev errors, hide in prod
  if (process.env.NODE_ENV === "development") {
    console.error("Unexpected error:", error);
  }

  return NextResponse.json(
    {
      error: "Something went wrong.",
      type: "InternalServerError",
      status: 500,
    },
    { status: 500 },
  );
}
