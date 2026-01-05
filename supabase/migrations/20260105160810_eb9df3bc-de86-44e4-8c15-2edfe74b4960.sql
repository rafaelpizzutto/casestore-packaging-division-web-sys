-- Insert footer_logo_url setting if it doesn't exist
INSERT INTO site_settings (key, value, type)
VALUES ('footer_logo_url', '', 'image')
ON CONFLICT (key) DO NOTHING;