export const SESSION_COOKIE = "skin_cure_admin_session";
export const SESSION_DURATION = 60 * 60 * 24 * 7;

export function encodeSessionCookie(userId: string): string {
  const sessionData = JSON.stringify({
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  });
  return Buffer.from(sessionData).toString("base64");
}
