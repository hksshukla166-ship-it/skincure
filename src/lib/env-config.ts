/**
 * Production-safe env access with fallbacks when hosting misconfigures .env files.
 */

const DEFAULTS = {
  NEXT_PUBLIC_SUPABASE_URL: "https://hvxxxopgyciijwpdgayc.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eHh4b3BneWNpaWp3cGRnYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTU4MTMsImV4cCI6MjEwMTY3MTgxM30.mjpIRnD0xTzm0YPPeVlmcj7l_Y-WoWeeRxUDytf-fNE",
  SUPABASE_SERVICE_ROLE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eHh4b3BneWNpaWp3cGRnYXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA5NTgxMywiZXhwIjoyMTAxNjcxODEzfQ.VMIgUTm1_BljHR6_Je_0y7oT8nAj5bwF1MGXA8PQ9ds",
  ADMIN_USERNAME: "ASkiNcare",
  ADMIN_PASSWORD: "SAskinCare134@1",
  NEXT_PUBLIC_SITE_URL: "https://skincurebilaspur.in",
} as const;

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function isBadProductionSiteUrl(value: string): boolean {
  return value.includes("localhost") || value.startsWith("http://");
}

function readEnv(name: keyof typeof DEFAULTS): string {
  const value = process.env[name]?.trim();

  if (!value) {
    return DEFAULTS[name];
  }

  if (isProduction() && name === "NEXT_PUBLIC_SITE_URL" && isBadProductionSiteUrl(value)) {
    return DEFAULTS[name];
  }

  return value;
}

export function getPublicSupabaseUrl(): string {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getPublicSupabaseAnonKey(): string {
  return readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getServiceRoleKey(): string {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getAdminUsername(): string {
  return readEnv("ADMIN_USERNAME");
}

export function getAdminPassword(): string {
  return readEnv("ADMIN_PASSWORD");
}

export function getSiteUrl(): string {
  return readEnv("NEXT_PUBLIC_SITE_URL");
}

export function shouldUseSecureCookies(): boolean {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  return getSiteUrl().startsWith("https://");
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getPublicSupabaseUrl() && getServiceRoleKey());
}

export function getEnvDiagnostics() {
  return {
    supabaseUrl: Boolean(getPublicSupabaseUrl()),
    serviceKey: Boolean(getServiceRoleKey()),
    siteUrl: getSiteUrl(),
    nodeEnv: process.env.NODE_ENV || "unknown",
    rawSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  };
}
