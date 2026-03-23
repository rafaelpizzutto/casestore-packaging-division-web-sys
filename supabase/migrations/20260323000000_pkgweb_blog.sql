-- Blog posts table
CREATE TABLE public.pkgweb_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  author TEXT DEFAULT 'CaseStore Team',
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  reading_time INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog categories table
CREATE TABLE public.pkgweb_blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FAQ table
CREATE TABLE public.pkgweb_faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pkgweb_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pkgweb_faq ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "pkgweb_public_view_posts" ON public.pkgweb_blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "pkgweb_public_view_categories" ON public.pkgweb_blog_categories FOR SELECT USING (true);
CREATE POLICY "pkgweb_public_view_faq" ON public.pkgweb_faq FOR SELECT USING (is_visible = true);

-- Admin write
CREATE POLICY "pkgweb_admin_posts" ON public.pkgweb_blog_posts FOR ALL TO authenticated USING (public.pkgweb_has_role(auth.uid(), 'admin')) WITH CHECK (public.pkgweb_has_role(auth.uid(), 'admin'));
CREATE POLICY "pkgweb_admin_categories" ON public.pkgweb_blog_categories FOR ALL TO authenticated USING (public.pkgweb_has_role(auth.uid(), 'admin')) WITH CHECK (public.pkgweb_has_role(auth.uid(), 'admin'));
CREATE POLICY "pkgweb_admin_faq" ON public.pkgweb_faq FOR ALL TO authenticated USING (public.pkgweb_has_role(auth.uid(), 'admin')) WITH CHECK (public.pkgweb_has_role(auth.uid(), 'admin'));

-- Updated_at triggers
CREATE TRIGGER pkgweb_upd_blog_posts BEFORE UPDATE ON public.pkgweb_blog_posts FOR EACH ROW EXECUTE FUNCTION public.pkgweb_update_updated_at();

-- Seed categories
INSERT INTO public.pkgweb_blog_categories (name, slug, description, sort_order) VALUES
  ('Packaging Solutions', 'packaging-solutions', 'Tips and guides for packaging materials and solutions', 1),
  ('Warehouse Automation', 'warehouse-automation', 'AI and technology for warehouse management', 2),
  ('Industry News', 'industry-news', 'Latest news in packaging and logistics', 3),
  ('Product Guides', 'product-guides', 'Detailed guides for our products', 4),
  ('Sustainability', 'sustainability', 'Eco-friendly packaging and green logistics', 5),
  ('Warehouse Tracker Features', 'warehouse-tracker-features', 'Features and updates of Warehouse Tracker AI', 6);
