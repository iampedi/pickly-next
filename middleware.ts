// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth/jwt";

const AUTH_COOKIE = "token";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files (e.g., /favicon.ico, /styles.css, etc.)
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? verifyJwt(token) : null;

  // Redirect authenticated users away from login/register
  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")
  ) {
    if (payload) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
    return NextResponse.next();
  }

  // Protect /panel routes
  if (pathname.startsWith("/panel") && !payload) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    loginUrl.searchParams.set("message", "login-required");
    return NextResponse.redirect(loginUrl);
  }

  console.log(
    "middleware file --------------------------",
    process.env.JWT_SECRET,
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/auth/login", "/auth/register"],
};
