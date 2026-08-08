import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-login";
import { encodeSessionCookie, SESSION_COOKIE, SESSION_DURATION } from "@/lib/session-constants";

export const runtime = "nodejs";

function loginRedirect(request: NextRequest, error?: string) {
  const url = new URL("/admin/login", request.url);
  if (error) url.searchParams.set("error", error.slice(0, 200));
  return NextResponse.redirect(url);
}

function setSessionCookie(response: NextResponse, request: NextRequest, userId: string) {
  response.cookies.set(SESSION_COOKIE, encodeSessionCookie(userId), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
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
      return loginRedirect(request, result.error);
    }

    const response = NextResponse.redirect(new URL("/admin/dashboard", request.url));
    setSessionCookie(response, request, result.userId);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return loginRedirect(request, message);
  }
}
