
-- 1. Rate limiting function for public form submissions
CREATE OR REPLACE FUNCTION public.check_submission_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Count submissions from same email in last hour
  EXECUTE format(
    'SELECT COUNT(*) FROM %I WHERE email = $1 AND created_at > now() - interval ''1 hour''',
    TG_TABLE_NAME
  ) INTO recent_count USING NEW.email;
  
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply rate limiting triggers
CREATE TRIGGER check_contact_rate_limit
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW EXECUTE FUNCTION public.check_submission_rate_limit();

CREATE TRIGGER check_quote_rate_limit
BEFORE INSERT ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION public.check_submission_rate_limit();

CREATE TRIGGER check_waitlist_rate_limit
BEFORE INSERT ON public.waitlist_signups
FOR EACH ROW EXECUTE FUNCTION public.check_submission_rate_limit();

-- 2. Restrict site_settings public SELECT to exclude sensitive keys
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;

CREATE POLICY "Public can view non-sensitive settings"
ON public.site_settings
FOR SELECT
USING (key NOT LIKE 'admin_%' AND key NOT LIKE 'internal_%');
