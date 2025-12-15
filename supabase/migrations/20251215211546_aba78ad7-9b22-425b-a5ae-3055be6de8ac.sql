-- Create waitlist_signups table
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  business_type TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit waitlist signup"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- Admins can view
CREATE POLICY "Admins can view waitlist signups"
ON public.waitlist_signups
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update
CREATE POLICY "Admins can update waitlist signups"
ON public.waitlist_signups
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete waitlist signups"
ON public.waitlist_signups
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Timestamp trigger
CREATE TRIGGER update_waitlist_signups_updated_at
BEFORE UPDATE ON public.waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add warehouse tracker page settings
INSERT INTO public.site_settings (key, value, type) VALUES
('warehouse_tracker_title', 'Warehouse Management Made Simple. Meet Warehouse Tracker AI.', 'text'),
('warehouse_tracker_subtitle', 'Transform your warehouse operations with AI-powered tools for order management, inventory tracking, and intelligent insights.', 'textarea'),
('warehouse_tracker_demo_link', '/contact', 'text'),
('warehouse_tracker_pricing_json', '[{"name":"Starter","description":"Perfect for small warehouses","features":["Up to 100 orders/month","Basic order tracking","Standard catalog","Email support"]},{"name":"Professional","description":"For growing operations","features":["Up to 500 orders/month","Advanced tracking & analytics","Custom catalogs","Priority support","AI insights"],"recommended":true},{"name":"Enterprise","description":"For large-scale operations","features":["Unlimited orders","Full AI suite","Custom integrations","Dedicated account manager","24/7 phone support"]}]', 'json'),
('warehouse_tracker_screenshot1', '', 'image'),
('warehouse_tracker_screenshot2', '', 'image')
ON CONFLICT (key) DO NOTHING;