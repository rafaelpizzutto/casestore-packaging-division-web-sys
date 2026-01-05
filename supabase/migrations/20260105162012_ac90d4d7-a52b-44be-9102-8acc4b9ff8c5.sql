-- Insert logo size settings if they don't exist
INSERT INTO site_settings (key, value, type)
VALUES 
  ('header_logo_height', '40', 'number'),
  ('footer_logo_height', '40', 'number')
ON CONFLICT (key) DO NOTHING;