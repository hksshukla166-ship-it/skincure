import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/data";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  try {
    const slots = await getAvailableSlots(date);
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ slots: [] });
  }
}
