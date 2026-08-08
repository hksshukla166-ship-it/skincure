import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { initializeAdmin, verifyPassword, SESSION_COOKIE, SESSION_DURATION } from "@/lib/auth";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = sanitizeText(body.username || "");
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    await initializeAdmin();

    const supabase = createAdminClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (profileError?.code === "PGRST205" || profileError?.code === "42P01") {
      return NextResponse.json({ error: "Admin database is not ready." }, { status: 503 });
    }

    if (profileError || !profile?.password_hash) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, profile.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const sessionData = JSON.stringify({
      userId: profile.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION * 1000,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, Buffer.from(sessionData).toString("base64"), {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
