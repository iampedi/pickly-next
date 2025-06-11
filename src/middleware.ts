// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

const AUTH_COOKIE = "token";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/\.[^/]+$/.test(pathname)) {
    return;
  }

  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")
  ) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const payload = token
      ? await verifyJwt(token, process.env.JWT_SECRET!)
      : null;
    if (payload) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
    return NextResponse.next();
  }

  // محافظت از مسیر /panel
  if (pathname.startsWith("/panel")) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const payload = token
      ? await verifyJwt(token, process.env.JWT_SECRET!)
      : null;
    if (!payload) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      loginUrl.searchParams.set("message", "login-required");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/auth/login", "/auth/register"],
};
