ALTER TABLE doctor ADD COLUMN IF NOT EXISTS honor_title TEXT DEFAULT 'Ex president IADVL CG 2025';

UPDATE doctor SET
  specialization = 'Consultant Dermatologist',
  qualification = 'MBBS DDVL',
  honor_title = COALESCE(honor_title, 'Ex president IADVL CG 2025')
WHERE specialization IS DISTINCT FROM 'Consultant Dermatologist'
   OR qualification IS DISTINCT FROM 'MBBS DDVL'
   OR honor_title IS NULL;

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

ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line1 TEXT DEFAULT 'Premium';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line2 TEXT DEFAULT 'Skin Care';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line3 TEXT DEFAULT 'You Deserve';

UPDATE settings SET
  hero_title_line1 = COALESCE(hero_title_line1, 'Premium'),
  hero_title_line2 = COALESCE(hero_title_line2, 'Skin Care'),
  hero_title_line3 = COALESCE(hero_title_line3, 'You Deserve')
WHERE hero_title_line1 IS NULL OR hero_title_line2 IS NULL OR hero_title_line3 IS NULL;
