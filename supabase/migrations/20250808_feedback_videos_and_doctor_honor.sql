-- Migration: doctor honor_title + patient feedback videos
-- Run in Supabase SQL Editor if upgrading an existing database

ALTER TABLE doctor ADD COLUMN IF NOT EXISTS honor_title TEXT DEFAULT 'Ex president IADVL CG 2025';

UPDATE doctor SET
  specialization = 'Consultant Dermatologist',
  qualification = 'MBBS DDVL',
  honor_title = 'Ex president IADVL CG 2025'
WHERE specialization = 'Dermatology / Skin Clinic'
   OR qualification = 'MBBS, MD (Dermatology)';

CREATE TABLE IF NOT EXISTS feedback_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  video_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_videos_active ON feedback_videos(is_active);

ALTER TABLE feedback_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active feedback videos" ON feedback_videos;
CREATE POLICY "Public read active feedback videos" ON feedback_videos FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role all feedback_videos" ON feedback_videos;
CREATE POLICY "Service role all feedback_videos" ON feedback_videos FOR ALL USING (true) WITH CHECK (true);
