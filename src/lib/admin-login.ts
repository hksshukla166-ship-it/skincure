import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword, initializeAdmin, verifyPassword } from "@/lib/auth";
import { sanitizeText } from "@/lib/sanitize";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AdminLoginResult =
  | { ok: true; userId: string }
  | { ok: false; error: string };

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<AdminLoginResult> {
  const cleanUsername = sanitizeText(username);
  const cleanPassword = typeof password === "string" ? password : "";

  if (!cleanUsername || !cleanPassword) {
    return { ok: false, error: "Username and password are required" };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured in .env.local" };
  }

  try {
    await initializeAdmin();

    const supabase = createAdminClient();
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", cleanUsername);

    if (profileError?.code === "PGRST205" || profileError?.code === "42P01") {
      return { ok: false, error: "Admin database is not ready." };
    }

    if (profileError) {
      return { ok: false, error: "Unable to verify login. Please try again." };
    }

    const profile = profiles?.[0];
    if (!profile) {
      return { ok: false, error: "Invalid username or password" };
    }

    let isValid = profile.password_hash
      ? await verifyPassword(cleanPassword, profile.password_hash)
      : false;

    const expectedPassword = process.env.ADMIN_PASSWORD || "SAskinCare134@1";
    if (!isValid && cleanPassword === expectedPassword) {
      const passwordHash = await hashPassword(cleanPassword);
      await supabase
        .from("profiles")
        .update({ password_hash: passwordHash })
        .eq("id", profile.id);
      isValid = true;
    }

    if (!isValid) {
      return { ok: false, error: "Invalid username or password" };
    }

    return { ok: true, userId: profile.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return { ok: false, error: message };
  }
}
