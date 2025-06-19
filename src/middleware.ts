// src/middleware.ts
import { verifyJwt } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  const isAuthPage =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isPanelPage = pathname.startsWith("/panel");

  if (isPanelPage) {
    if (!payload) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      loginUrl.searchParams.set("message", "login-required");
      return NextResponse.redirect(loginUrl);
    }

    if (payload.role === "USER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthPage && payload) {
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/panel/:path*", "/auth/login", "/auth/register"],
};
