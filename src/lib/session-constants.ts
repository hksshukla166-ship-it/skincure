export const SESSION_COOKIE = "skin_cure_admin_session";
export const SESSION_DURATION = 60 * 60 * 24 * 7;

export function encodeSessionCookie(userId: string): string {
  const sessionData = JSON.stringify({
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  });

  if (typeof Buffer !== "undefined") {
    return Buffer.from(sessionData).toString("base64");
  }

  return btoa(sessionData);
}

export function decodeSessionCookie(value: string): { userId: string } | null {
  try {
    const json =
      typeof Buffer !== "undefined"
        ? Buffer.from(value, "base64").toString("utf-8")
        : atob(value);

    const data = JSON.parse(json) as { userId?: string; expiresAt?: number };
    if (!data.userId || !data.expiresAt || data.expiresAt < Date.now()) {
      return null;
    }

    return { userId: data.userId };
  } catch {
    return null;
  }
}

export function buildSessionSetCookieHeader(userId: string, secure: boolean): string {
  const value = encodeSessionCookie(userId);
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_DURATION}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
