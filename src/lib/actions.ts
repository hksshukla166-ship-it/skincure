"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureStorageBuckets } from "@/lib/supabase/buckets";
import { runDatabaseSetup } from "@/lib/supabase/setup-database";
import { requireAdmin, verifyPassword, createSession, destroySession, hashPassword, initializeAdmin } from "@/lib/auth";
import { sanitizeText, sanitizePhone } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import type { AppointmentFormData } from "@/types";

export async function loginAction(formData: FormData) {
  const username = sanitizeText(formData.get("username") as string);
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  await initializeAdmin();

  const supabase = createAdminClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (profileError?.code === "PGRST205") {
    return { error: "Database not initialized. Use 'Initialize Database' on login page first." };
  }

  if (!profile) {
    return { error: "Invalid credentials" };
  }

  const isValid = await verifyPassword(password, profile.password_hash);
  if (!isValid) {
    return { error: "Invalid credentials" };
  }

  await createSession(profile.id);
  return { success: true };
}

export async function logoutAction() {
  await destroySession();
  return { success: true };
}

export async function bookAppointment(data: AppointmentFormData) {
  const supabase = createAdminClient();

  const patient_name = sanitizeText(data.patient_name);
  const phone = sanitizePhone(data.phone);
  const problem = sanitizeText(data.problem);
  const gender = data.gender;
  const age = Number(data.age);
  const preferred_date = data.preferred_date;
  const slot_time = data.slot_time;

  if (!patient_name || !phone || !problem || !preferred_date || !slot_time) {
    return { error: "All fields are required" };
  }

  if (age < 1 || age > 120) {
    return { error: "Please enter a valid age" };
  }

  const { data: holiday } = await supabase
    .from("holiday_schedule")
    .select("*")
    .eq("date", preferred_date)
    .single();

  if (holiday?.is_closed) {
    return { error: "Clinic is closed on the selected date" };
  }

  const { data: settings } = await supabase.from("settings").select("holiday_mode, max_patients_per_day").single();

  if (settings?.holiday_mode) {
    return { error: "Clinic is currently in holiday mode. Please try again later." };
  }

  const { data: existingBooking } = await supabase
    .from("appointments")
    .select("id")
    .eq("preferred_date", preferred_date)
    .eq("slot_time", slot_time)
    .not("status", "in", '("cancelled","rejected")')
    .single();

  if (existingBooking) {
    return { error: "This time slot is no longer available" };
  }

  const { count: dayCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("preferred_date", preferred_date)
    .not("status", "in", '("cancelled","rejected")');

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
    .select()
    .single();

  if (error) {
    return { error: "Failed to book appointment. Please try again." };
  }

  await supabase.from("notifications").insert({
    type: "new_booking",
    title: "New Appointment Booking",
    message: `${patient_name} booked for ${preferred_date} at ${slot_time}`,
    reference_id: appointment.id,
  });

  revalidatePath("/");
  revalidatePath("/admin/appointments");

  return { success: true, appointment };
}

export async function updateAppointmentStatus(
  id: string,
  status: string,
  adminNotes?: string
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("appointments")
    .update({
      status,
      admin_notes: adminNotes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Failed to update appointment" };

  const notificationType = status === "cancelled" ? "cancelled" : "system";
  await supabase.from("notifications").insert({
    type: notificationType,
    title: `Appointment ${status}`,
    message: `Appointment has been marked as ${status}`,
    reference_id: id,
  });

  revalidatePath("/admin/appointments");
  return { success: true };
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  await ensureStorageBuckets();

  const supabase = createAdminClient();

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  let uploadError = error;

  if (uploadError) {
    if (uploadError.message.includes("Bucket not found")) {
      await ensureStorageBuckets();
      const retry = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      uploadError = retry.error;
    }
    if (uploadError) return { error: uploadError.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function setupSupabaseStorage() {
  await requireAdmin();
  return ensureStorageBuckets();
}

export async function setupDatabase() {
  await requireAdmin();
  const [db, buckets] = await Promise.all([
    runDatabaseSetup(),
    ensureStorageBuckets(),
  ]);
  return { database: db, buckets };
}

export async function deleteFile(bucket: string, path: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.storage.from(bucket).remove([path]);
  return { success: true };
}

export async function updateDoctor(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: existing } = await supabase.from("doctor").select("id").single();

  const updateData = {
    name: sanitizeText(formData.get("name") as string),
    qualification: sanitizeText(formData.get("qualification") as string),
    experience: sanitizeText(formData.get("experience") as string),
    specialization: sanitizeText(formData.get("specialization") as string),
    about: sanitizeText(formData.get("about") as string),
    clinic_timing: sanitizeText(formData.get("clinic_timing") as string),
    image_url: formData.get("image_url") as string || null,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    await supabase.from("doctor").update(updateData).eq("id", existing.id);
  } else {
    await supabase.from("doctor").insert(updateData);
  }

  revalidatePath("/");
  revalidatePath("/about");
  return { success: true };
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: existing } = await supabase.from("settings").select("id").single();

  const updateData = {
    clinic_name: sanitizeText(formData.get("clinic_name") as string),
    phone: sanitizePhone(formData.get("phone") as string),
    address: sanitizeText(formData.get("address") as string),
    opening_hours: sanitizeText(formData.get("opening_hours") as string),
    google_rating: parseFloat(formData.get("google_rating") as string) || 5.0,
    google_reviews_count: parseInt(formData.get("google_reviews_count") as string) || 0,
    google_maps_link: formData.get("google_maps_link") as string || null,
    whatsapp_number: sanitizePhone(formData.get("whatsapp_number") as string),
    logo_url: formData.get("logo_url") as string || null,
    primary_color: formData.get("primary_color") as string,
    secondary_color: formData.get("secondary_color") as string,
    holiday_mode: formData.get("holiday_mode") === "true",
    max_patients_per_day: parseInt(formData.get("max_patients_per_day") as string) || 50,
    patient_counter: parseInt(formData.get("patient_counter") as string) || 5000,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    await supabase.from("settings").update(updateData).eq("id", existing.id);
  } else {
    await supabase.from("settings").insert(updateData);
  }

  revalidatePath("/");
  return { success: true };
}

export async function manageService(action: "create" | "update" | "delete", data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (action === "create") {
    await supabase.from("services").insert({
      title: sanitizeText(data.title as string),
      description: sanitizeText(data.description as string),
      icon: data.icon as string || "sparkles",
      sort_order: data.sort_order as number || 0,
    });
  } else if (action === "update") {
    await supabase.from("services").update({
      title: sanitizeText(data.title as string),
      description: sanitizeText(data.description as string),
      icon: data.icon as string,
      is_active: data.is_active as boolean,
      sort_order: data.sort_order as number,
    }).eq("id", data.id as string);
  } else if (action === "delete") {
    await supabase.from("services").delete().eq("id", data.id as string);
  }

  revalidatePath("/");
  revalidatePath("/services");
  return { success: true };
}

export async function manageGallery(action: "create" | "update" | "delete", data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (action === "create") {
    await supabase.from("gallery").insert({
      title: sanitizeText(data.title as string),
      media_url: data.media_url as string,
      media_type: data.media_type as string || "image",
      category: data.category as string || "general",
      sort_order: data.sort_order as number || 0,
    });
  } else if (action === "update") {
    await supabase.from("gallery").update({
      title: sanitizeText(data.title as string),
      category: data.category as string,
      is_active: data.is_active as boolean,
      sort_order: data.sort_order as number,
    }).eq("id", data.id as string);
  } else if (action === "delete") {
    await supabase.from("gallery").delete().eq("id", data.id as string);
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  return { success: true };
}

export async function manageTestimonial(action: "create" | "update" | "delete", data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (action === "create") {
    await supabase.from("testimonials").insert({
      patient_name: sanitizeText(data.patient_name as string),
      city: sanitizeText(data.city as string),
      rating: data.rating as number || 5,
      review: sanitizeText(data.review as string),
      photo_url: data.photo_url as string || null,
      sort_order: data.sort_order as number || 0,
    });
  } else if (action === "update") {
    await supabase.from("testimonials").update({
      patient_name: sanitizeText(data.patient_name as string),
      city: sanitizeText(data.city as string),
      rating: data.rating as number,
      review: sanitizeText(data.review as string),
      is_visible: data.is_visible as boolean,
    }).eq("id", data.id as string);
  } else if (action === "delete") {
    await supabase.from("testimonials").delete().eq("id", data.id as string);
  }

  revalidatePath("/");
  return { success: true };
}

export async function manageSlot(action: "create" | "update" | "delete", data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (action === "create") {
    await supabase.from("appointment_slots").insert({
      slot_time: data.slot_time as string,
      sort_order: data.sort_order as number || 0,
    });
  } else if (action === "update") {
    await supabase.from("appointment_slots").update({
      slot_time: data.slot_time as string,
      is_active: data.is_active as boolean,
      sort_order: data.sort_order as number,
    }).eq("id", data.id as string);
  } else if (action === "delete") {
    await supabase.from("appointment_slots").delete().eq("id", data.id as string);
  }

  revalidatePath("/");
  revalidatePath("/appointment");
  return { success: true };
}

export async function manageBlog(action: "create" | "update" | "delete", data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (action === "create") {
    const title = sanitizeText(data.title as string);
    await supabase.from("blogs").insert({
      title,
      slug: slugify(title),
      excerpt: sanitizeText(data.excerpt as string),
      content: data.content as string,
      cover_image_url: data.cover_image_url as string || null,
      meta_title: sanitizeText(data.meta_title as string),
      meta_description: sanitizeText(data.meta_description as string),
      is_published: data.is_published as boolean || false,
      published_at: data.is_published ? new Date().toISOString() : null,
    });
  } else if (action === "update") {
    await supabase.from("blogs").update({
      title: sanitizeText(data.title as string),
      excerpt: sanitizeText(data.excerpt as string),
      content: data.content as string,
      cover_image_url: data.cover_image_url as string || null,
      meta_title: sanitizeText(data.meta_title as string),
      meta_description: sanitizeText(data.meta_description as string),
      is_published: data.is_published as boolean,
      published_at: data.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq("id", data.id as string);
  } else if (action === "delete") {
    await supabase.from("blogs").delete().eq("id", data.id as string);
  }

  revalidatePath("/blog");
  return { success: true };
}

export async function manageFAQ(action: "create" | "update" | "delete", data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (action === "create") {
    await supabase.from("faq").insert({
      question: sanitizeText(data.question as string),
      answer: sanitizeText(data.answer as string),
      sort_order: data.sort_order as number || 0,
    });
  } else if (action === "update") {
    await supabase.from("faq").update({
      question: sanitizeText(data.question as string),
      answer: sanitizeText(data.answer as string),
      is_active: data.is_active as boolean,
    }).eq("id", data.id as string);
  } else if (action === "delete") {
    await supabase.from("faq").delete().eq("id", data.id as string);
  }

  revalidatePath("/about");
  return { success: true };
}

export async function manageHoliday(action: "create" | "delete", data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (action === "create") {
    await supabase.from("holiday_schedule").insert({
      date: data.date as string,
      reason: sanitizeText(data.reason as string),
      is_closed: data.is_closed as boolean ?? true,
      special_timing: data.special_timing as string || null,
    });
  } else if (action === "delete") {
    await supabase.from("holiday_schedule").delete().eq("id", data.id as string);
  }

  revalidatePath("/appointment");
  return { success: true };
}

export async function markNotificationRead(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  return { success: true };
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { userId } = await requireAdmin();
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("password_hash")
    .eq("id", userId)
    .single();

  if (!profile) return { error: "Profile not found" };

  const isValid = await verifyPassword(currentPassword, profile.password_hash);
  if (!isValid) return { error: "Current password is incorrect" };

  const newHash = await hashPassword(newPassword);
  await supabase.from("profiles").update({ password_hash: newHash }).eq("id", userId);

  return { success: true };
}

export async function submitContactForm(formData: FormData) {
  const name = sanitizeText(formData.get("name") as string);
  const email = sanitizeText(formData.get("email") as string);
  const message = sanitizeText(formData.get("message") as string);
  const phone = sanitizePhone(formData.get("phone") as string);

  if (!name || !message) {
    return { error: "Name and message are required" };
  }

  const supabase = createAdminClient();
  await supabase.from("notifications").insert({
    type: "system",
    title: "New Contact Form Submission",
    message: `From: ${name} (${phone || email})\n${message}`,
  });

  return { success: true };
}
