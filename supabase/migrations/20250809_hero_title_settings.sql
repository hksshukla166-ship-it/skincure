-- Homepage hero title (Skincure headline)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line1 TEXT DEFAULT 'Skincure';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line2 TEXT DEFAULT 'Center for excellence in applied Dermatology & Lasers';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line3 TEXT DEFAULT 'Wast experience in genital disease';

UPDATE settings SET
  hero_title_line1 = 'Skincure',
  hero_title_line2 = 'Center for excellence in applied Dermatology & Lasers',
  hero_title_line3 = 'Wast experience in genital disease'
WHERE hero_title_line1 IS NULL
   OR hero_title_line2 IS NULL
   OR hero_title_line3 IS NULL
   OR (hero_title_line1 = 'Premium' AND hero_title_line2 = 'Skin Care' AND hero_title_line3 = 'You Deserve');
