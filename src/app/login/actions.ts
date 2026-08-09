"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateAdmin } from "@/lib/admin-login";
import { SESSION_COOKIE, SESSION_DURATION, encodeSessionCookie } from "@/lib/session-constants";

function shouldUseSecureCookies(): boolean {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (siteUrl.startsWith("http://")) return false;
  if (siteUrl.includes("localhost")) return false;
  return true;
}

export async function loginFormAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const result = await authenticateAdmin(username, password);

  if (!result.ok) {
    redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSessionCookie(result.userId), {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });

  redirect("/admin/dashboard");
}
