import { NextResponse } from "next/server";
import { ensureStorageBuckets } from "@/lib/supabase/buckets";

export async function POST() {
  try {
    const result = await ensureStorageBuckets();
    return NextResponse.json({
      success: true,
      message: "Storage buckets initialized",
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Setup failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await ensureStorageBuckets();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Setup failed" },
      { status: 500 }
    );
  }
}
