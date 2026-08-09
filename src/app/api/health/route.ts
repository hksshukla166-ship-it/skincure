import { NextResponse } from "next/server";
import { getEnvDiagnostics, isSupabaseConfigured } from "@/lib/env-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    supabaseConfigured: isSupabaseConfigured(),
    ...getEnvDiagnostics(),
  });
}
