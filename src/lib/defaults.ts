import type { Settings, Doctor, Service, FAQ, AppointmentSlot } from "@/types";

export const DEFAULT_SETTINGS: Settings = {
  id: "default-settings",
  clinic_name: "SKIN CURE",
  phone: "07828093301",
  address: "Skin Cure Link Road Narayan Plaza Agrasen Chowk Telipara Bilaspur Chhattisgarh 495001",
  opening_hours: "Open Daily · Closes at 7 PM",
  google_rating: 5.0,
  google_reviews_count: 155,
  google_maps_link: null,
  whatsapp_number: "917828093301",
  logo_url: null,
  favicon_url: null,
  banner_url: null,
  primary_color: "#1e3a8a",
  secondary_color: "#d4af37",
  social_links: {},
  holiday_mode: false,
  max_patients_per_day: 50,
  patient_counter: 5000,
  site_url: null,
  hero_title_line1: "Premium",
  hero_title_line2: "Skin Care",
  hero_title_line3: "You Deserve",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_DOCTOR: Doctor = {
  id: "default-doctor",
  name: "Dr. Ajay Pandey",
  qualification: "MBBS DDVL",
  experience: "15+ Years",
  specialization: "Consultant Dermatologist",
  honor_title: "Ex president IADVL CG 2025",
  about:
    "Dr. Ajay Pandey is a renowned dermatologist with over 15 years of experience in treating various skin, hair, and nail conditions. His expertise spans across medical and cosmetic dermatology, providing personalized care to every patient at SKIN CURE clinic in Bilaspur.",
  image_url: null,
  clinic_timing: "Open Daily · Closes at 7 PM",
  certificates: [],
  awards: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SERVICES: Service[] = [
  { id: "1", title: "Skin Treatment", description: "Comprehensive treatment for all skin conditions including acne, eczema, and psoriasis.", icon: "sparkles", image_url: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", title: "Hair Care", description: "Advanced solutions for hair loss, dandruff, and scalp disorders.", icon: "scissors", image_url: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", title: "Nail Treatment", description: "Expert care for fungal infections and nail disorders.", icon: "hand", image_url: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", title: "Pigmentation", description: "Effective treatments for melasma, dark spots, and uneven skin tone.", icon: "sun", image_url: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", title: "Acne Treatment", description: "Medical-grade acne solutions for all age groups.", icon: "droplets", image_url: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", title: "Eczema & Psoriasis", description: "Specialized care for chronic inflammatory skin conditions.", icon: "heart-pulse", image_url: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", title: "Vitiligo Treatment", description: "Advanced therapies for vitiligo and depigmentation.", icon: "circle-dot", image_url: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", title: "Hair Loss Treatment", description: "PRP, mesotherapy, and medical treatments for hair restoration.", icon: "wind", image_url: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", title: "Laser Procedures", description: "State-of-the-art laser treatments for skin rejuvenation.", icon: "zap", image_url: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "10", title: "Chemical Peel", description: "Professional chemical peels for glowing, youthful skin.", icon: "flask-conical", image_url: null, sort_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "11", title: "Skin Rejuvenation", description: "Anti-aging treatments and skin renewal procedures.", icon: "star", image_url: null, sort_order: 11, is_active: true, created_at: "", updated_at: "" },
  { id: "12", title: "Skin Allergy", description: "Diagnosis and treatment of allergic skin reactions.", icon: "shield", image_url: null, sort_order: 12, is_active: true, created_at: "", updated_at: "" },
];

export const DEFAULT_SLOTS: AppointmentSlot[] = [
  "9:00 AM", "9:20 AM", "9:40 AM", "10:00 AM", "10:20 AM", "10:40 AM",
  "11:00 AM", "11:20 AM", "11:40 AM", "12:00 PM", "12:20 PM", "12:40 PM",
  "4:00 PM", "4:20 PM", "4:40 PM", "5:00 PM", "5:20 PM", "5:40 PM",
  "6:00 PM", "6:20 PM", "6:40 PM",
].map((time, i) => ({
  id: `slot-${i}`,
  slot_time: time,
  is_active: true,
  sort_order: i + 1,
  created_at: new Date().toISOString(),
}));

export const DEFAULT_FAQ: FAQ[] = [
  { id: "1", question: "What are the clinic timings?", answer: "SKIN CURE is open daily and closes at 7 PM. We recommend booking an appointment in advance.", sort_order: 1, is_active: true, created_at: "" },
  { id: "2", question: "How do I book an appointment?", answer: "You can book online through our website or contact us via WhatsApp. Select your preferred date and time slot.", sort_order: 2, is_active: true, created_at: "" },
  { id: "3", question: "Do you treat hair loss?", answer: "Yes, we offer comprehensive hair loss treatments including PRP therapy, mesotherapy, and medical management.", sort_order: 3, is_active: true, created_at: "" },
  { id: "4", question: "Is laser treatment safe?", answer: "Absolutely. All our laser procedures are performed by qualified professionals using FDA-approved equipment.", sort_order: 4, is_active: true, created_at: "" },
  { id: "5", question: "What should I bring for my first visit?", answer: "Please bring any previous medical reports, list of current medications, and your ID proof.", sort_order: 5, is_active: true, created_at: "" },
];

export function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    (error.message?.includes("Could not find the table") ?? false)
  );
}
