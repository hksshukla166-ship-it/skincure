export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  experience: string;
  specialization: string;
  honor_title: string | null;
  about: string | null;
  image_url: string | null;
  clinic_timing: string;
  certificates: Certificate[];
  awards: Award[];
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  title: string;
  image_url: string;
  year?: string;
}

export interface Award {
  title: string;
  description?: string;
  year?: string;
}

export interface Settings {
  id: string;
  clinic_name: string;
  phone: string;
  address: string;
  opening_hours: string;
  google_rating: number;
  google_reviews_count: number;
  google_maps_link: string | null;
  whatsapp_number: string;
  logo_url: string | null;
  favicon_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  social_links: SocialLinks;
  holiday_mode: boolean;
  max_patients_per_day: number;
  patient_counter: number;
  site_url: string | null;
  hero_title_line1: string | null;
  hero_title_line2: string | null;
  hero_title_line3: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  media_url: string;
  media_type: "image" | "video";
  category: "general" | "before_after" | "clinic" | "treatment";
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FeedbackVideo {
  id: string;
  title: string | null;
  video_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  patient_name: string;
  city: string | null;
  rating: number;
  review: string;
  photo_url: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface AppointmentSlot {
  id: string;
  slot_time: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  problem: string;
  preferred_date: string;
  slot_time: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled" | "rescheduled";
  admin_notes: string | null;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  type: "new_booking" | "cancelled" | "upcoming" | "system";
  title: string;
  message: string;
  is_read: boolean;
  reference_id: string | null;
  created_at: string;
}

export interface HolidaySchedule {
  id: string;
  date: string;
  reason: string | null;
  is_closed: boolean;
  special_timing: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  password_hash: string;
  role: "admin" | "super_admin";
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalAppointments: number;
  todayBookings: number;
  upcomingAppointments: number;
  cancelledAppointments: number;
  completedAppointments: number;
  galleryCount: number;
  visitorCount: number;
  pendingAppointments: number;
}

export interface AppointmentFormData {
  patient_name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  problem: string;
  preferred_date: string;
  slot_time: string;
}

export interface PatientRecipient {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  age: number | null;
  gender: "Male" | "Female" | "Other" | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Broadcast {
  id: string;
  title: string;
  notice: string;
  status: "draft" | "queued" | "sending" | "completed" | "failed" | "cancelled";
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface BroadcastMessage {
  id: string;
  broadcast_id: string;
  patient_id: string | null;
  phone: string;
  patient_name: string | null;
  message_body: string;
  status: "pending" | "sent" | "failed" | "skipped";
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}
