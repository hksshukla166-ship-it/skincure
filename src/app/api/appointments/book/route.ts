import { NextRequest, NextResponse } from "next/server";
import { bookAppointmentRequest } from "@/lib/book-appointment";
import type { AppointmentFormData } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST appointment data to this endpoint" });
}

export async function POST(request: NextRequest) {
  try {
    let body: AppointmentFormData;
    try {
      body = (await request.json()) as AppointmentFormData;
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = await bookAppointmentRequest(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, appointmentId: result.appointmentId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
