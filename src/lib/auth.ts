import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getAdminPassword, shouldUseSecureCookies } from "./env-config";
import { createAdminClient } from "./supabase/admin";
import { SESSION_COOKIE, SESSION_DURATION, encodeSessionCookie, decodeSessionCookie } from "./session-constants";
export { SESSION_COOKIE, SESSION_DURATION };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, encodeSessionCookie(userId), {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie?.value) return null;

  return decodeSessionCookie(sessionCookie.value);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin(): Promise<{ userId: string; username: string }> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", session.userId)
    .single();

  if (!profile) {
    throw new Error("Unauthorized");
  }

  return { userId: profile.id, username: profile.username };
}

export async function initializeAdmin(): Promise<void> {
  try {
    const supabase = createAdminClient();
    const username = process.env.ADMIN_USERNAME || "ASkiNcare";
    const password = getAdminPassword();

    const { data: existing, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (error?.code === "PGRST205") return;
    if (existing) return;

    const passwordHash = await hashPassword(password);
    await supabase.from("profiles").insert({
      username,
      password_hash: passwordHash,
      role: "super_admin",
    });
  } catch {
    // Database not ready yet
  }
}
