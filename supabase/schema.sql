-- SKIN CURE - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (admin users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor profile
CREATE TABLE IF NOT EXISTS doctor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Dr. Ajay Pandey',
  qualification TEXT DEFAULT 'MBBS DDVL',
  experience TEXT DEFAULT '15+ Years',
  specialization TEXT DEFAULT 'Consultant Dermatologist',
  honor_title TEXT DEFAULT 'Ex president IADVL CG 2025',
  about TEXT,
  image_url TEXT,
  clinic_timing TEXT DEFAULT 'Open Daily · Closes at 7 PM',
  certificates JSONB DEFAULT '[]'::jsonb,
  awards JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_name TEXT DEFAULT 'SKIN CURE',
  phone TEXT DEFAULT '07828093301',
  address TEXT DEFAULT 'Skin Cure Link Road Narayan Plaza Agrasen Chowk Telipara Bilaspur Chhattisgarh 495001',
  opening_hours TEXT DEFAULT 'Open Daily · Closes at 7 PM',
  google_rating DECIMAL(2,1) DEFAULT 5.0,
  google_reviews_count INTEGER DEFAULT 155,
  google_maps_link TEXT,
  whatsapp_number TEXT DEFAULT '917828093301',
  logo_url TEXT,
  favicon_url TEXT,
  banner_url TEXT,
  primary_color TEXT DEFAULT '#1e3a8a',
  secondary_color TEXT DEFAULT '#d4af37',
  social_links JSONB DEFAULT '{}'::jsonb,
  holiday_mode BOOLEAN DEFAULT FALSE,
  max_patients_per_day INTEGER DEFAULT 50,
  patient_counter INTEGER DEFAULT 5000,
  site_url TEXT,
  hero_title_line1 TEXT DEFAULT 'Premium',
  hero_title_line2 TEXT DEFAULT 'Skin Care',
  hero_title_line3 TEXT DEFAULT 'You Deserve',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'sparkles',
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'before_after', 'clinic', 'treatment')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient feedback videos (homepage)
CREATE TABLE IF NOT EXISTS feedback_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  video_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  city TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  photo_url TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointment slots
CREATE TABLE IF NOT EXISTS appointment_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_time TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Holiday schedule
CREATE TABLE IF NOT EXISTS holiday_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  is_closed BOOLEAN DEFAULT TRUE,
  special_timing TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT NOT NULL,
  problem TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled', 'rescheduled')),
  admin_notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('new_booking', 'cancelled', 'upcoming', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor analytics (simple counter)
CREATE TABLE IF NOT EXISTS visitor_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_date DATE DEFAULT CURRENT_DATE,
  page_views INTEGER DEFAULT 1,
  UNIQUE(visit_date)
);

-- Patient recipients (bulk messaging list, 10k+ capacity)
CREATE TABLE IF NOT EXISTS patient_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  city TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Other')),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broadcast notices / campaigns
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  notice TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'sending', 'completed', 'failed', 'cancelled')),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Individual broadcast message delivery logs
CREATE TABLE IF NOT EXISTS broadcast_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broadcast_id UUID NOT NULL REFERENCES broadcasts(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patient_recipients(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  patient_name TEXT,
  message_body TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(phone);
CREATE INDEX IF NOT EXISTS idx_patient_recipients_phone ON patient_recipients(phone);
CREATE INDEX IF NOT EXISTS idx_patient_recipients_active ON patient_recipients(is_active);
CREATE INDEX IF NOT EXISTS idx_patient_recipients_name ON patient_recipients(name);
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_broadcast ON broadcast_messages(broadcast_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_status ON broadcast_messages(broadcast_id, status);
CREATE INDEX IF NOT EXISTS idx_feedback_videos_active ON feedback_videos(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "Public read doctor" ON doctor;
CREATE POLICY "Public read doctor" ON doctor FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read settings" ON settings;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read active services" ON services;
CREATE POLICY "Public read active services" ON services FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read active gallery" ON gallery;
CREATE POLICY "Public read active gallery" ON gallery FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read active feedback videos" ON feedback_videos;
CREATE POLICY "Public read active feedback videos" ON feedback_videos FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read visible testimonials" ON testimonials;
CREATE POLICY "Public read visible testimonials" ON testimonials FOR SELECT USING (is_visible = true);
DROP POLICY IF EXISTS "Public read active slots" ON appointment_slots;
CREATE POLICY "Public read active slots" ON appointment_slots FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read holidays" ON holiday_schedule;
CREATE POLICY "Public read holidays" ON holiday_schedule FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Public read active faq" ON faq;
CREATE POLICY "Public read active faq" ON faq FOR SELECT USING (is_active = true);

-- Public insert for appointments
DROP POLICY IF EXISTS "Public insert appointments" ON appointments;
CREATE POLICY "Public insert appointments" ON appointments FOR INSERT WITH CHECK (true);

-- Service role full access
DROP POLICY IF EXISTS "Service role all profiles" ON profiles;
CREATE POLICY "Service role all profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all doctor" ON doctor;
CREATE POLICY "Service role all doctor" ON doctor FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all settings" ON settings;
CREATE POLICY "Service role all settings" ON settings FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all services" ON services;
CREATE POLICY "Service role all services" ON services FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all gallery" ON gallery;
CREATE POLICY "Service role all gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all feedback_videos" ON feedback_videos;
CREATE POLICY "Service role all feedback_videos" ON feedback_videos FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all testimonials" ON testimonials;
CREATE POLICY "Service role all testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all slots" ON appointment_slots;
CREATE POLICY "Service role all slots" ON appointment_slots FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all holidays" ON holiday_schedule;
CREATE POLICY "Service role all holidays" ON holiday_schedule FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all appointments" ON appointments;
CREATE POLICY "Service role all appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all blogs" ON blogs;
CREATE POLICY "Service role all blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all faq" ON faq;
CREATE POLICY "Service role all faq" ON faq FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all notifications" ON notifications;
CREATE POLICY "Service role all notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all visitor_stats" ON visitor_stats;
CREATE POLICY "Service role all visitor_stats" ON visitor_stats FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all patient_recipients" ON patient_recipients;
CREATE POLICY "Service role all patient_recipients" ON patient_recipients FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all broadcasts" ON broadcasts;
CREATE POLICY "Service role all broadcasts" ON broadcasts FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Service role all broadcast_messages" ON broadcast_messages;
CREATE POLICY "Service role all broadcast_messages" ON broadcast_messages FOR ALL USING (true) WITH CHECK (true);

-- Storage buckets (run in Supabase Dashboard > Storage)
-- Create buckets: doctor-images, gallery, videos, testimonials, blogs, certificates
-- Set public read access for all buckets

-- Seed default data (run after migrations.sql for upgraded databases)
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS honor_title TEXT DEFAULT 'Ex president IADVL CG 2025';

INSERT INTO settings (clinic_name, phone, address, opening_hours) 
SELECT 'SKIN CURE', '07828093301', 
  'Skin Cure Link Road Narayan Plaza Agrasen Chowk Telipara Bilaspur Chhattisgarh 495001',
  'Open Daily · Closes at 7 PM'
WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);

INSERT INTO doctor (name, qualification, experience, specialization, honor_title, about, clinic_timing)
SELECT 'Dr. Ajay Pandey', 'MBBS DDVL', '15+ Years', 
  'Consultant Dermatologist',
  'Ex president IADVL CG 2025',
  'Dr. Ajay Pandey is a renowned dermatologist with over 15 years of experience in treating various skin, hair, and nail conditions. His expertise spans across medical and cosmetic dermatology, providing personalized care to every patient at SKIN CURE clinic in Bilaspur.',
  'Open Daily · Closes at 7 PM'
WHERE NOT EXISTS (SELECT 1 FROM doctor LIMIT 1);

INSERT INTO services (title, description, icon, sort_order)
SELECT * FROM (VALUES
  ('Skin Treatment', 'Comprehensive treatment for all skin conditions including acne, eczema, and psoriasis.', 'sparkles', 1),
  ('Hair Care', 'Advanced solutions for hair loss, dandruff, and scalp disorders.', 'scissors', 2),
  ('Nail Treatment', 'Expert care for fungal infections and nail disorders.', 'hand', 3),
  ('Pigmentation', 'Effective treatments for melasma, dark spots, and uneven skin tone.', 'sun', 4),
  ('Acne Treatment', 'Medical-grade acne solutions for all age groups.', 'droplets', 5),
  ('Eczema & Psoriasis', 'Specialized care for chronic inflammatory skin conditions.', 'heart-pulse', 6),
  ('Vitiligo Treatment', 'Advanced therapies for vitiligo and depigmentation.', 'circle-dot', 7),
  ('Hair Loss Treatment', 'PRP, mesotherapy, and medical treatments for hair restoration.', 'wind', 8),
  ('Laser Procedures', 'State-of-the-art laser treatments for skin rejuvenation.', 'zap', 9),
  ('Chemical Peel', 'Professional chemical peels for glowing, youthful skin.', 'flask-conical', 10),
  ('Skin Rejuvenation', 'Anti-aging treatments and skin renewal procedures.', 'star', 11),
  ('Skin Allergy', 'Diagnosis and treatment of allergic skin reactions.', 'shield', 12)
) AS v(title, description, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

INSERT INTO appointment_slots (slot_time, sort_order)
SELECT * FROM (VALUES
  ('9:00 AM', 1), ('9:20 AM', 2), ('9:40 AM', 3), ('10:00 AM', 4),
  ('10:20 AM', 5), ('10:40 AM', 6), ('11:00 AM', 7), ('11:20 AM', 8),
  ('11:40 AM', 9), ('12:00 PM', 10), ('12:20 PM', 11), ('12:40 PM', 12),
  ('4:00 PM', 13), ('4:20 PM', 14), ('4:40 PM', 15), ('5:00 PM', 16),
  ('5:20 PM', 17), ('5:40 PM', 18), ('6:00 PM', 19), ('6:20 PM', 20),
  ('6:40 PM', 21)
) AS v(slot_time, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM appointment_slots LIMIT 1);

INSERT INTO faq (question, answer, sort_order)
SELECT * FROM (VALUES
  ('What are the clinic timings?', 'SKIN CURE is open daily and closes at 7 PM. We recommend booking an appointment in advance.', 1),
  ('How do I book an appointment?', 'You can book online through our website or contact us via WhatsApp. Select your preferred date and time slot.', 2),
  ('Do you treat hair loss?', 'Yes, we offer comprehensive hair loss treatments including PRP therapy, mesotherapy, and medical management.', 3),
  ('Is laser treatment safe?', 'Absolutely. All our laser procedures are performed by qualified professionals using FDA-approved equipment.', 4),
  ('What should I bring for my first visit?', 'Please bring any previous medical reports, list of current medications, and your ID proof.', 5)
) AS v(question, answer, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM faq LIMIT 1);
