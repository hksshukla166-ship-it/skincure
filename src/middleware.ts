import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSessionCookie, SESSION_COOKIE } from "@/lib/session-constants";

function getValidSession(request: NextRequest) {
  const value = request.cookies.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return decodeSessionCookie(value);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getValidSession(request);

  if (pathname === "/admin/login" || pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
