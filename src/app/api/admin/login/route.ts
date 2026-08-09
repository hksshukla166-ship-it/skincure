import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import {
  getAdminPassword,
  getPublicSupabaseUrl,
  getServiceRoleKey,
  getSiteUrl,
  shouldUseSecureCookies,
} from "@/lib/env-config";
import { buildSessionSetCookieHeader } from "@/lib/session-constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function originFromRequest(request: NextRequest): string {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return getSiteUrl() || request.nextUrl.origin;
}

function redirectTo(request: NextRequest, path: string, userId?: string) {
  const url = new URL(path, originFromRequest(request));
  const headers = new Headers({ Location: url.toString() });
  if (userId) {
    const secure = shouldUseSecureCookies() || originFromRequest(request).startsWith("https://");
    headers.set("Set-Cookie", buildSessionSetCookieHeader(userId, secure));
  }
  return new NextResponse(null, { status: 303, headers });
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", originFromRequest(request)));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    if (!username || !password) {
      return redirectTo(request, "/login?error=Username+and+password+are+required");
    }

    const supabase = createClient(getPublicSupabaseUrl(), getServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, password_hash")
      .ilike("username", username)
      .limit(1);

    if (error) {
      return redirectTo(request, `/login?error=${encodeURIComponent(error.message)}`);
    }

    const profile = profiles?.[0];
    if (!profile?.password_hash) {
      return redirectTo(request, "/login?error=Invalid+username+or+password");
    }

    let valid = await bcrypt.compare(password, profile.password_hash);
    const expectedPassword = getAdminPassword();

    if (!valid && password === expectedPassword) {
      const hash = await bcrypt.hash(password, 12);
      await supabase.from("profiles").update({ password_hash: hash }).eq("id", profile.id);
      valid = true;
    }

    if (!valid) {
      return redirectTo(request, "/login?error=Invalid+username+or+password");
    }

    return redirectTo(request, "/admin/dashboard", profile.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return redirectTo(request, `/login?error=${encodeURIComponent(message)}`);
  }
}
