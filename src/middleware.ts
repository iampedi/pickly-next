// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

const AUTH_COOKIE = "token";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/\.[^/]+$/.test(pathname)) {
    return;
  }

  // بررسی لاگین بودن برای مسیرهای auth
  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")
  ) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const payload = token
      ? await verifyJwt(token, process.env.JWT_SECRET!)
      : null;
    if (payload) {
      // اگر لاگین بود، منتقل کن به /panel
      return NextResponse.redirect(new URL("/panel", request.url));
    }
    // اگر لاگین نبود، اجازه بده ادامه بده به صفحه login/register
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

// این مسیرها رو چک می‌کنه:
export const config = {
  matcher: ["/panel/:path*", "/auth/login", "/auth/register"],
};
