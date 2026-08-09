import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  DEFAULT_SETTINGS,
  DEFAULT_DOCTOR,
  DEFAULT_SERVICES,
  DEFAULT_FAQ,
  DEFAULT_SLOTS,
  isMissingTableError,
} from "@/lib/defaults";
import type {
  Doctor,
  Settings,
  Service,
  GalleryItem,
  Testimonial,
  FeedbackVideo,
  AppointmentSlot,
  FAQ,
  Blog,
  Appointment,
  DashboardStats,
  HolidaySchedule,
  Notification,
} from "@/types";

async function getPublicClient() {
  if (!isSupabaseConfigured()) return null;
  try {
    return await createClient();
  } catch {
    return null;
  }
}

function getAdminClientSafe() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

export async function getSettings(): Promise<Settings | null> {
  const supabase = await getPublicClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase.from("settings").select("*").single();
  if (error && isMissingTableError(error)) return DEFAULT_SETTINGS;
  if (error || !data) return DEFAULT_SETTINGS;

  return buildSettings(data);
}

function buildSettings(data: Settings): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...data,
    ...mergeHeroFromDefaults(data),
  };
}

function mergeHeroFromDefaults(data: Partial<Settings> | null | undefined) {
  const line1 = data?.hero_title_line1?.trim();
  const line2 = data?.hero_title_line2?.trim();
  const line3 = data?.hero_title_line3?.trim();
  const isLegacyTitle =
    line1 === "Premium" && line2 === "Skin Care" && line3 === "You Deserve";

  if (!line1 || !line2 || !line3 || isLegacyTitle) {
    return {
      hero_title_line1: DEFAULT_SETTINGS.hero_title_line1,
      hero_title_line2: DEFAULT_SETTINGS.hero_title_line2,
      hero_title_line3: DEFAULT_SETTINGS.hero_title_line3,
    };
  }

  return {
    hero_title_line1: line1,
    hero_title_line2: line2,
    hero_title_line3: line3,
  };
}

export async function getDoctor(): Promise<Doctor | null> {
  const supabase = await getPublicClient();
  if (!supabase) return DEFAULT_DOCTOR;

  const { data, error } = await supabase.from("doctor").select("*").single();
  if (error) {
    if (isMissingTableError(error)) return DEFAULT_DOCTOR;
    return DEFAULT_DOCTOR;
  }
  return data ?? DEFAULT_DOCTOR;
}

export async function getServices(): Promise<Service[]> {
  const supabase = await getPublicClient();
  if (!supabase) return DEFAULT_SERVICES;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error && isMissingTableError(error)) return DEFAULT_SERVICES;
  return data?.length ? data : DEFAULT_SERVICES;
}

export async function getGallery(category?: string): Promise<GalleryItem[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error && isMissingTableError(error)) return [];
  return data || [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");

  if (error && isMissingTableError(error)) return [];
  return data || [];
}

export async function getFeedbackVideos(): Promise<FeedbackVideo[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("feedback_videos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error && isMissingTableError(error)) return [];
  return data || [];
}

export async function getAppointmentSlots(): Promise<AppointmentSlot[]> {
  const supabase = await getPublicClient();
  if (!supabase) return DEFAULT_SLOTS;

  const { data, error } = await supabase
    .from("appointment_slots")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error && isMissingTableError(error)) return DEFAULT_SLOTS;
  return data?.length ? data : DEFAULT_SLOTS;
}

export async function getAvailableSlots(date: string): Promise<string[]> {
  const supabase = getAdminClientSafe() ?? (await getPublicClient());
  if (!supabase) return DEFAULT_SLOTS.map((s) => s.slot_time);

  try {
    const { data: holiday } = await supabase
      .from("holiday_schedule")
      .select("*")
      .eq("date", date)
      .maybeSingle();

    if (holiday?.is_closed) return [];

    const { data: settings } = await supabase.from("settings").select("holiday_mode").maybeSingle();
    if (settings?.holiday_mode) return [];

    const { data: slots, error: slotsError } = await supabase
      .from("appointment_slots")
      .select("slot_time")
      .eq("is_active", true)
      .order("sort_order");

    if (slotsError && isMissingTableError(slotsError)) {
      return DEFAULT_SLOTS.map((s) => s.slot_time);
    }

    const { data: booked } = await supabase
      .from("appointments")
      .select("slot_time")
      .eq("preferred_date", date)
      .not("status", "in", '("cancelled","rejected")');

    const bookedTimes = new Set(booked?.map((b) => b.slot_time) || []);
    const available = (slots || DEFAULT_SLOTS.map((s) => ({ slot_time: s.slot_time })))
      .map((s) => s.slot_time)
      .filter((time) => !bookedTimes.has(time));

    return available;
  } catch {
    return DEFAULT_SLOTS.map((s) => s.slot_time);
  }
}

export async function getFAQ(): Promise<FAQ[]> {
  const supabase = await getPublicClient();
  if (!supabase) return DEFAULT_FAQ;

  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error && isMissingTableError(error)) return DEFAULT_FAQ;
  return data?.length ? data : DEFAULT_FAQ;
}

export async function getBlogs(): Promise<Blog[]> {
  const supabase = await getPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error && isMissingTableError(error)) return [];
  return data || [];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await getPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error && isMissingTableError(error)) return null;
  return data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getAdminClientSafe();
  if (!supabase) {
    return {
      totalAppointments: 0,
      todayBookings: 0,
      upcomingAppointments: 0,
      cancelledAppointments: 0,
      completedAppointments: 0,
      galleryCount: 0,
      visitorCount: 0,
      pendingAppointments: 0,
    };
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const [
      { count: totalAppointments },
      { count: todayBookings },
      { count: upcomingAppointments },
      { count: cancelledAppointments },
      { count: completedAppointments },
      { count: galleryCount },
      { count: pendingAppointments },
    ] = await Promise.all([
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("preferred_date", today),
      supabase.from("appointments").select("*", { count: "exact", head: true }).gte("preferred_date", today).eq("status", "approved"),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    const { data: visitorData } = await supabase.from("visitor_stats").select("page_views");
    const visitorCount = visitorData?.reduce((sum, v) => sum + (v.page_views || 0), 0) || 0;

    return {
      totalAppointments: totalAppointments || 0,
      todayBookings: todayBookings || 0,
      upcomingAppointments: upcomingAppointments || 0,
      cancelledAppointments: cancelledAppointments || 0,
      completedAppointments: completedAppointments || 0,
      galleryCount: galleryCount || 0,
      visitorCount,
      pendingAppointments: pendingAppointments || 0,
    };
  } catch {
    return {
      totalAppointments: 0,
      todayBookings: 0,
      upcomingAppointments: 0,
      cancelledAppointments: 0,
      completedAppointments: 0,
      galleryCount: 0,
      visitorCount: 0,
      pendingAppointments: 0,
    };
  }
}

export async function getAllAppointments(filters?: {
  status?: string;
  search?: string;
  date?: string;
}): Promise<Appointment[]> {
  const supabase = getAdminClientSafe();
  if (!supabase) return [];

  let query = supabase.from("appointments").select("*").order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.date) query = query.eq("preferred_date", filters.date);
  if (filters?.search) {
    query = query.or(
      `patient_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,problem.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error && isMissingTableError(error)) return [];
  return data || [];
}

export async function getNotifications(): Promise<Notification[]> {
  const supabase = getAdminClientSafe();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error && isMissingTableError(error)) return [];
  return data || [];
}

export async function getHolidays(): Promise<HolidaySchedule[]> {
  const supabase = getAdminClientSafe();
  if (!supabase) return [];

  const { data, error } = await supabase.from("holiday_schedule").select("*").order("date");
  if (error && isMissingTableError(error)) return [];
  return data || [];
}

export async function incrementVisitorCount(): Promise<void> {
  const supabase = getAdminClientSafe();
  if (!supabase) return;

  try {
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("visitor_stats")
      .select("*")
      .eq("visit_date", today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("visitor_stats")
        .update({ page_views: (existing.page_views || 0) + 1 })
        .eq("visit_date", today);
    } else {
      await supabase.from("visitor_stats").insert({ visit_date: today, page_views: 1 });
    }
  } catch {
    // Non-critical
  }
}

export async function searchContent(query: string) {
  const supabase = await getPublicClient();
  if (!supabase) return [];

  const searchTerm = `%${query}%`;
  const results = [];

  try {
    const [services, blogs, doctor] = await Promise.all([
      supabase.from("services").select("id, title, description").ilike("title", searchTerm).eq("is_active", true),
      supabase.from("blogs").select("id, title, slug, excerpt").ilike("title", searchTerm).eq("is_published", true),
      supabase.from("doctor").select("name, specialization, about").maybeSingle(),
    ]);

    if (doctor.data?.name?.toLowerCase().includes(query.toLowerCase())) {
      results.push({ type: "doctor", title: doctor.data.name, description: doctor.data.specialization });
    }

    services.data?.forEach((s) => {
      results.push({ type: "service", title: s.title, description: s.description, id: s.id });
    });

    blogs.data?.forEach((b) => {
      results.push({ type: "blog", title: b.title, description: b.excerpt, slug: b.slug });
    });
  } catch {
    return [];
  }

  return results;
}
