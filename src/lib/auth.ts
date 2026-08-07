import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createAdminClient } from "./supabase/admin";

const SESSION_COOKIE = "skin_cure_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

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
  const sessionData = JSON.stringify({
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  });

  cookieStore.set(SESSION_COOKIE, Buffer.from(sessionData).toString("base64"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie?.value) return null;

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );

    if (sessionData.expiresAt < Date.now()) {
      await destroySession();
      return null;
    }

    return { userId: sessionData.userId };
  } catch {
    return null;
  }
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
    const password = process.env.ADMIN_PASSWORD || "SAskinCare134@1";

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
