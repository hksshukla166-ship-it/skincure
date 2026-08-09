import { getPublicSupabaseUrl, getPublicSupabaseAnonKey, getServiceRoleKey } from "../env-config";

export function getSupabaseUrl(): string {
  return getPublicSupabaseUrl();
}

export function getSupabaseAnonKey(): string {
  return getPublicSupabaseAnonKey();
}

export function getSupabaseServiceKey(): string {
  return getServiceRoleKey();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getPublicSupabaseUrl() && getServiceRoleKey());
}
