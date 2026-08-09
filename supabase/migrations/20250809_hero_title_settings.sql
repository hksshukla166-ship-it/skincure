-- Homepage hero title lines (admin editable)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line1 TEXT DEFAULT 'Premium';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line2 TEXT DEFAULT 'Skin Care';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title_line3 TEXT DEFAULT 'You Deserve';

UPDATE settings SET
  hero_title_line1 = COALESCE(hero_title_line1, 'Premium'),
  hero_title_line2 = COALESCE(hero_title_line2, 'Skin Care'),
  hero_title_line3 = COALESCE(hero_title_line3, 'You Deserve')
WHERE hero_title_line1 IS NULL OR hero_title_line2 IS NULL OR hero_title_line3 IS NULL;
