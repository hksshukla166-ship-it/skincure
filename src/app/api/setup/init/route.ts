import { NextRequest, NextResponse } from "next/server";
import { runDatabaseSetup } from "@/lib/supabase/setup-database";
import { ensureStorageBuckets } from "@/lib/supabase/buckets";
import { initializeAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dbPassword = body.dbPassword as string;

    if (!dbPassword) {
      return NextResponse.json({ success: false, message: "Database password required" }, { status: 400 });
    }

    // Temporarily set password for setup function
    process.env.SUPABASE_DB_PASSWORD = dbPassword;

    const dbResult = await runDatabaseSetup();
    const bucketResult = await ensureStorageBuckets();

    if (!dbResult.success) {
      return NextResponse.json({ success: false, message: dbResult.message, details: dbResult.details });
    }

    // Initialize admin user after tables exist
    await initializeAdmin();

    // Verify tables work
    const supabase = createAdminClient();
    const { error } = await supabase.from("settings").select("id").limit(1);
    if (error) {
      return NextResponse.json({
        success: false,
        message: "Tables created but verification failed: " + error.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully! Login with ASkiNcare / SAskinCare134@1",
      database: dbResult,
      buckets: bucketResult,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Setup failed" },
      { status: 500 }
    );
  }
}
