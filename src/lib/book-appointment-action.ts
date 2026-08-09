"use server";

import { revalidatePath } from "next/cache";
import { bookAppointmentRequest } from "@/lib/book-appointment";
import type { AppointmentFormData } from "@/types";

export async function bookAppointmentAction(data: AppointmentFormData) {
  try {
    const result = await bookAppointmentRequest(data);

    if ("error" in result) {
      return { error: result.error };
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/appointments");
    } catch {
      // Non-critical on some hosts
    }

    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking failed";
    return { error: message };
  }
}
