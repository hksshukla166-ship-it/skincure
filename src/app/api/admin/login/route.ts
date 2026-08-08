import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-login";
import { buildSessionSetCookieHeader } from "@/lib/session-constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectTo(request: NextRequest, path: string, cookieHeader?: string) {
  const url = new URL(path, request.url);
  const headers = new Headers({ Location: url.toString() });
  if (cookieHeader) headers.set("Set-Cookie", cookieHeader);
  return new NextResponse(null, { status: 303, headers });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const result = await authenticateAdmin(
      typeof username === "string" ? username : "",
      typeof password === "string" ? password : ""
    );

    if (!result.ok) {
      const errorUrl = `/login?error=${encodeURIComponent(result.error)}`;
      return redirectTo(request, errorUrl);
    }

    const secure = request.nextUrl.protocol === "https:";
    const cookie = buildSessionSetCookieHeader(result.userId, secure);
    return redirectTo(request, "/admin/dashboard", cookie);
  } catch {
    return redirectTo(request, "/login?error=Login%20failed.%20Please%20try%20again.");
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}
