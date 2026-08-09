import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseAnonKey, getPublicSupabaseUrl } from "@/lib/env-config";

export function createClient() {
  return createBrowserClient(getPublicSupabaseUrl(), getPublicSupabaseAnonKey());
}