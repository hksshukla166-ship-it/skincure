import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { bookAppointmentRequest } from "@/lib/book-appointment";
import type { AppointmentFormData } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AppointmentFormData;
    const result = await bookAppointmentRequest(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/admin/appointments");

    return NextResponse.json({ success: true, appointmentId: result.appointmentId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
