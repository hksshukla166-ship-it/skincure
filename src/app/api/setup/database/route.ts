import { NextResponse } from "next/server";
import { runDatabaseSetup } from "@/lib/supabase/setup-database";
import { ensureStorageBuckets } from "@/lib/supabase/buckets";

export async function POST() {
  try {
    const [dbResult, bucketResult] = await Promise.all([
      runDatabaseSetup(),
      ensureStorageBuckets(),
    ]);

    return NextResponse.json({
      database: dbResult,
      buckets: bucketResult,
      success: dbResult.success,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Setup failed" },
      { status: 500 }
    );
  }
}
