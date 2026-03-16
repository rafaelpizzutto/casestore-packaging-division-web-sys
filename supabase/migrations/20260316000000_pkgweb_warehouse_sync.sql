-- Add warehouse quote tracking columns to quote requests
ALTER TABLE pkgweb_quote_requests
  ADD COLUMN IF NOT EXISTS warehouse_quote_id UUID,
  ADD COLUMN IF NOT EXISTS warehouse_quote_number TEXT;
