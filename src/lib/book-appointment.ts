import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizePhone, sanitizeText } from "@/lib/sanitize";
import type { AppointmentFormData } from "@/types";

export type BookAppointmentResult =
  | { success: true; appointmentId: string }
  | { error: string };

export async function bookAppointmentRequest(
  data: AppointmentFormData
): Promise<BookAppointmentResult> {
  try {
    const supabase = createAdminClient();

    const patient_name = sanitizeText(data.patient_name);
    const phone = sanitizePhone(data.phone);
    const problem = sanitizeText(data.problem);
    const gender = data.gender;
    const age = Number(data.age);
    const preferred_date = data.preferred_date;
    const slot_time = sanitizeText(data.slot_time);

    if (!patient_name || !phone || !problem || !preferred_date || !slot_time) {
      return { error: "All fields are required" };
    }

    if (!Number.isFinite(age) || age < 1 || age > 120) {
      return { error: "Please enter a valid age" };
    }

    if (slot_time !== "Morning" && slot_time !== "Evening") {
      return { error: "Please select Morning or Evening" };
    }

    const { data: holiday } = await supabase
      .from("holiday_schedule")
      .select("is_closed")
      .eq("date", preferred_date)
      .maybeSingle();

    if (holiday?.is_closed) {
      return { error: "Clinic is closed on the selected date" };
    }

    const { data: settings } = await supabase
      .from("settings")
      .select("holiday_mode, max_patients_per_day")
      .maybeSingle();

    if (settings?.holiday_mode) {
      return { error: "Clinic is currently in holiday mode. Please try again later." };
    }

    const { data: existingBooking } = await supabase
      .from("appointments")
      .select("id")
      .eq("preferred_date", preferred_date)
      .eq("slot_time", slot_time)
      .in("status", ["pending", "approved", "completed", "rescheduled"])
      .maybeSingle();

    if (existingBooking) {
      return { error: "This time preference is already booked for the selected date" };
    }

    const { count: dayCount } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("preferred_date", preferred_date)
      .in("status", ["pending", "approved", "completed", "rescheduled"]);

    if (dayCount && settings?.max_patients_per_day && dayCount >= settings.max_patients_per_day) {
      return { error: "Maximum appointments reached for this date" };
    }

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_name,
        age,
        gender,
        phone,
        problem,
        preferred_date,
        slot_time,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !appointment) {
      return { error: error?.message || "Failed to book appointment. Please try again." };
    }

    const { error: notificationError } = await supabase.from("notifications").insert({
      type: "new_booking",
      title: "New Appointment Booking",
      message: `${patient_name} booked for ${preferred_date} (${slot_time})`,
      reference_id: appointment.id,
    });

    if (notificationError) {
      console.error("Notification insert failed:", notificationError.message);
    }

    return { success: true, appointmentId: appointment.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking failed";
    return { error: message };
  }
}
