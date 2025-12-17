-- Fix storage bucket policies for site-assets
-- Only admins can upload/update/delete, public can read

CREATE POLICY "Admins can upload to site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can read site-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-assets' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-assets' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add input validation constraints to contact_submissions
ALTER TABLE public.contact_submissions 
ADD CONSTRAINT check_name_length CHECK (length(name) <= 100),
ADD CONSTRAINT check_email_length CHECK (length(email) <= 255),
ADD CONSTRAINT check_company_length CHECK (company IS NULL OR length(company) <= 200),
ADD CONSTRAINT check_message_length CHECK (length(message) <= 5000);

-- Add input validation constraints to quote_requests
ALTER TABLE public.quote_requests 
ADD CONSTRAINT check_qr_name_length CHECK (length(name) <= 100),
ADD CONSTRAINT check_qr_email_length CHECK (length(email) <= 255),
ADD CONSTRAINT check_qr_company_length CHECK (company IS NULL OR length(company) <= 200),
ADD CONSTRAINT check_qr_phone_length CHECK (phone IS NULL OR length(phone) <= 50),
ADD CONSTRAINT check_qr_product_interest_length CHECK (product_interest IS NULL OR length(product_interest) <= 500),
ADD CONSTRAINT check_qr_quantity_length CHECK (estimated_quantity IS NULL OR length(estimated_quantity) <= 100),
ADD CONSTRAINT check_qr_message_length CHECK (message IS NULL OR length(message) <= 5000);

-- Add input validation constraints to waitlist_signups
ALTER TABLE public.waitlist_signups 
ADD CONSTRAINT check_ws_name_length CHECK (length(name) <= 100),
ADD CONSTRAINT check_ws_email_length CHECK (length(email) <= 255),
ADD CONSTRAINT check_ws_company_length CHECK (company IS NULL OR length(company) <= 200),
ADD CONSTRAINT check_ws_phone_length CHECK (phone IS NULL OR length(phone) <= 50),
ADD CONSTRAINT check_ws_business_type_length CHECK (business_type IS NULL OR length(business_type) <= 100),
ADD CONSTRAINT check_ws_notes_length CHECK (notes IS NULL OR length(notes) <= 2000);