import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-login";
import { SESSION_COOKIE, SESSION_DURATION } from "@/lib/auth";

export const runtime = "nodejs";

function loginRedirect(request: NextRequest, error?: string) {
  const url = new URL("/admin/login", request.url);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

function dashboardRedirect(request: NextRequest, userId: string) {
  const sessionData = JSON.stringify({
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  });

  const response = NextResponse.redirect(new URL("/admin/dashboard", request.url));
  response.cookies.set(SESSION_COOKIE, Buffer.from(sessionData).toString("base64"), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
  return response;
}

async function readCredentials(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    return {
      username: body.username as string,
      password: body.password as string,
    };
  }

  const formData = await request.formData();
  return {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await readCredentials(request);
    const result = await authenticateAdmin(username, password);

    if (!result.ok) {
      const wantsJson = (request.headers.get("content-type") || "").includes("application/json");
      if (wantsJson) {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }
      return loginRedirect(request, result.error);
    }

    const wantsJson = (request.headers.get("content-type") || "").includes("application/json");
    if (wantsJson) {
      const response = NextResponse.json({ success: true });
      const sessionData = JSON.stringify({
        userId: result.userId,
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION * 1000,
      });
      response.cookies.set(SESSION_COOKIE, Buffer.from(sessionData).toString("base64"), {
        httpOnly: true,
        secure: request.nextUrl.protocol === "https:",
        sameSite: "lax",
        maxAge: SESSION_DURATION,
        path: "/",
      });
      return response;
    }

    return dashboardRedirect(request, result.userId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return loginRedirect(request, message);
  }
}
