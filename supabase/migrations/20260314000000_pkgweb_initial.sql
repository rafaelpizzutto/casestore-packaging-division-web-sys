-- ============================================================
-- CaseStore Packaging Division Web System
-- All tables prefixed with pkgweb_ to avoid conflicts with
-- WarehouseTrackerIA tables in the same Supabase project
-- ============================================================

-- Enum for roles (prefixed to avoid conflict)
CREATE TYPE public.pkgweb_app_role AS ENUM ('admin', 'user');

-- ============================================================
-- TABLES
-- ============================================================

-- Site settings (logo, title, contact info)
CREATE TABLE public.pkgweb_site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Navigation menu items
CREATE TABLE public.pkgweb_menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Page content (hero sections, images, text blocks)
CREATE TABLE public.pkgweb_page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin user roles
CREATE TABLE public.pkgweb_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role pkgweb_app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Contact form submissions
CREATE TABLE public.pkgweb_contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pkgweb_check_name_length CHECK (length(name) <= 100),
  CONSTRAINT pkgweb_check_email_length CHECK (length(email) <= 255),
  CONSTRAINT pkgweb_check_company_length CHECK (company IS NULL OR length(company) <= 200),
  CONSTRAINT pkgweb_check_message_length CHECK (length(message) <= 5000)
);

-- Quote requests
CREATE TABLE public.pkgweb_quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  product_interest TEXT,
  estimated_quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pkgweb_check_qr_name_length CHECK (length(name) <= 100),
  CONSTRAINT pkgweb_check_qr_email_length CHECK (length(email) <= 255),
  CONSTRAINT pkgweb_check_qr_company_length CHECK (company IS NULL OR length(company) <= 200),
  CONSTRAINT pkgweb_check_qr_phone_length CHECK (phone IS NULL OR length(phone) <= 50),
  CONSTRAINT pkgweb_check_qr_product_interest_length CHECK (product_interest IS NULL OR length(product_interest) <= 500),
  CONSTRAINT pkgweb_check_qr_quantity_length CHECK (estimated_quantity IS NULL OR length(estimated_quantity) <= 100),
  CONSTRAINT pkgweb_check_qr_message_length CHECK (message IS NULL OR length(message) <= 5000)
);

-- Waitlist signups
CREATE TABLE public.pkgweb_waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  business_type TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pkgweb_check_ws_name_length CHECK (length(name) <= 100),
  CONSTRAINT pkgweb_check_ws_email_length CHECK (length(email) <= 255),
  CONSTRAINT pkgweb_check_ws_company_length CHECK (company IS NULL OR length(company) <= 200),
  CONSTRAINT pkgweb_check_ws_phone_length CHECK (phone IS NULL OR length(phone) <= 50),
  CONSTRAINT pkgweb_check_ws_business_type_length CHECK (business_type IS NULL OR length(business_type) <= 100),
  CONSTRAINT pkgweb_check_ws_notes_length CHECK (notes IS NULL OR length(notes) <= 2000)
);

-- Products
CREATE TABLE public.pkgweb_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2),
  image_url TEXT,
  is_new BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Check role function
CREATE OR REPLACE FUNCTION public.pkgweb_has_role(_user_id UUID, _role pkgweb_app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.pkgweb_user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.pkgweb_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Rate limiter function
CREATE OR REPLACE FUNCTION public.pkgweb_check_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
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

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER pkgweb_upd_site_settings BEFORE UPDATE ON public.pkgweb_site_settings FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();
CREATE TRIGGER pkgweb_upd_menu_items BEFORE UPDATE ON public.pkgweb_menu_items FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();
CREATE TRIGGER pkgweb_upd_page_content BEFORE UPDATE ON public.pkgweb_page_content FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();
CREATE TRIGGER pkgweb_upd_contact_submissions BEFORE UPDATE ON public.pkgweb_contact_submissions FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();
CREATE TRIGGER pkgweb_upd_quote_requests BEFORE UPDATE ON public.pkgweb_quote_requests FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();
CREATE TRIGGER pkgweb_upd_waitlist_signups BEFORE UPDATE ON public.pkgweb_waitlist_signups FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();
CREATE TRIGGER pkgweb_upd_products BEFORE UPDATE ON public.pkgweb_products FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();

-- Rate limit triggers
CREATE TRIGGER pkgweb_rate_contact BEFORE INSERT ON public.pkgweb_contact_submissions FOR EACH ROW EXECUTE FUNCTION public.pkgweb_check_rate_limit();
CREATE TRIGGER pkgweb_rate_quote BEFORE INSERT ON public.pkgweb_quote_requests FOR EACH ROW EXECUTE FUNCTION public.pkgweb_check_rate_limit();
CREATE TRIGGER pkgweb_rate_waitlist BEFORE INSERT ON public.pkgweb_waitlist_signups FOR EACH ROW EXECUTE FUNCTION public.pkgweb_check_rate_limit();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.pkgweb_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_products ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "pkgweb_public_view_settings" ON public.pkgweb_site_settings FOR SELECT USING (key NOT LIKE 'admin_%' AND key NOT LIKE 'internal_%');
CREATE POLICY "pkgweb_public_view_menu" ON public.pkgweb_menu_items FOR SELECT USING (true);
CREATE POLICY "pkgweb_public_view_content" ON public.pkgweb_page_content FOR SELECT USING (true);
CREATE POLICY "pkgweb_public_view_products" ON public.pkgweb_products FOR SELECT USING (is_visible = true);

-- Public insert policies (form submissions)
CREATE POLICY "pkgweb_public_submit_contact" ON public.pkgweb_contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "pkgweb_public_submit_quote" ON public.pkgweb_quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "pkgweb_public_submit_waitlist" ON public.pkgweb_waitlist_signups FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "pkgweb_admin_settings" ON public.pkgweb_site_settings FOR ALL TO authenticated USING (public.pkgweb_has_role(auth.uid(), 'admin')) WITH CHECK (public.pkgweb_has_role(auth.uid(), 'admin'));
CREATE POLICY "pkgweb_admin_menu" ON public.pkgweb_menu_items FOR ALL TO authenticated USING (public.pkgweb_has_role(auth.uid(), 'admin')) WITH CHECK (public.pkgweb_has_role(auth.uid(), 'admin'));
CREATE POLICY "pkgweb_admin_content" ON public.pkgweb_page_content FOR ALL TO authenticated USING (public.pkgweb_has_role(auth.uid(), 'admin')) WITH CHECK (public.pkgweb_has_role(auth.uid(), 'admin'));
CREATE POLICY "pkgweb_admin_products" ON public.pkgweb_products FOR ALL TO authenticated USING (public.pkgweb_has_role(auth.uid(), 'admin')) WITH CHECK (public.pkgweb_has_role(auth.uid(), 'admin'));

CREATE POLICY "pkgweb_admin_view_contacts" ON public.pkgweb_contact_submissions FOR SELECT USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_admin_update_contacts" ON public.pkgweb_contact_submissions FOR UPDATE USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_admin_delete_contacts" ON public.pkgweb_contact_submissions FOR DELETE USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));

CREATE POLICY "pkgweb_admin_view_quotes" ON public.pkgweb_quote_requests FOR SELECT USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_admin_update_quotes" ON public.pkgweb_quote_requests FOR UPDATE USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_admin_delete_quotes" ON public.pkgweb_quote_requests FOR DELETE USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));

CREATE POLICY "pkgweb_admin_view_waitlist" ON public.pkgweb_waitlist_signups FOR SELECT USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_admin_update_waitlist" ON public.pkgweb_waitlist_signups FOR UPDATE USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_admin_delete_waitlist" ON public.pkgweb_waitlist_signups FOR DELETE USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));

-- User roles policies
CREATE POLICY "pkgweb_view_own_roles" ON public.pkgweb_user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "pkgweb_admin_assign_roles" ON public.pkgweb_user_roles FOR INSERT TO authenticated WITH CHECK (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_prevent_role_updates" ON public.pkgweb_user_roles FOR UPDATE TO authenticated USING (false);
CREATE POLICY "pkgweb_admin_remove_roles" ON public.pkgweb_user_roles FOR DELETE TO authenticated USING (pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));

-- ============================================================
-- STORAGE
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('pkgweb-site-assets', 'pkgweb-site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "pkgweb_admin_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pkgweb-site-assets' AND public.pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'pkgweb-site-assets');
CREATE POLICY "pkgweb_admin_update_storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'pkgweb-site-assets' AND public.pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));
CREATE POLICY "pkgweb_admin_delete_storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'pkgweb-site-assets' AND public.pkgweb_has_role(auth.uid(), 'admin'::pkgweb_app_role));

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO public.pkgweb_menu_items (name, path, sort_order) VALUES
  ('Home', '/', 1),
  ('Products', '/products', 2),
  ('Warehouse Tracker AI', '/warehouse-tracker', 3),
  ('About Us', '/about', 4),
  ('Contact', '/contact', 5);

INSERT INTO public.pkgweb_site_settings (key, value, type) VALUES
  ('site_name', 'CaseStore', 'text'),
  ('logo_url', '', 'image'),
  ('contact_email', 'info@casestore.us', 'text'),
  ('contact_phone', '', 'text'),
  ('footer_logo_url', '', 'image'),
  ('header_logo_height', '40', 'number'),
  ('footer_logo_height', '40', 'number'),
  ('warehouse_tracker_title', 'Warehouse Management Made Simple. Meet Warehouse Tracker AI.', 'text'),
  ('warehouse_tracker_subtitle', 'Transform your warehouse operations with AI-powered tools for order management, inventory tracking, and intelligent insights.', 'textarea'),
  ('warehouse_tracker_demo_link', '/contact', 'text'),
  ('warehouse_tracker_pricing_json', '[{"name":"Starter","description":"Perfect for small warehouses","features":["Up to 100 orders/month","Basic order tracking","Standard catalog","Email support"]},{"name":"Professional","description":"For growing operations","features":["Up to 500 orders/month","Advanced tracking & analytics","Custom catalogs","Priority support","AI insights"],"recommended":true},{"name":"Enterprise","description":"For large-scale operations","features":["Unlimited orders","Full AI suite","Custom integrations","Dedicated account manager","24/7 phone support"]}]', 'json'),
  ('warehouse_tracker_screenshot1', '', 'image'),
  ('warehouse_tracker_screenshot2', '', 'image');
