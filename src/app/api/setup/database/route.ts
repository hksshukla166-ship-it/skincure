import { NextResponse } from "next/server";
import { runDatabaseSetup } from "@/lib/supabase/setup-database";
import { ensureStorageBuckets } from "@/lib/supabase/buckets";
import { initializeAdmin } from "@/lib/auth";

export async function POST() {
  try {
    const [dbResult, bucketResult] = await Promise.all([
      runDatabaseSetup(),
      ensureStorageBuckets(),
    ]);

    if (dbResult.success) {
      await initializeAdmin();
    }

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
