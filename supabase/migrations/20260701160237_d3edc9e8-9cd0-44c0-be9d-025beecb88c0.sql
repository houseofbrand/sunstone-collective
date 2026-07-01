
-- Catalogue downloads
CREATE TABLE public.catalogue_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  gst TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.catalogue_downloads TO anon, authenticated;
GRANT ALL ON public.catalogue_downloads TO service_role;
ALTER TABLE public.catalogue_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit downloads" ON public.catalogue_downloads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can view downloads" ON public.catalogue_downloads FOR SELECT TO authenticated USING (true);

-- Inquiries
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  gst TEXT,
  country TEXT,
  city TEXT,
  business_type TEXT,
  product_category TEXT,
  product_code TEXT,
  quantity INTEGER,
  message TEXT,
  source TEXT DEFAULT 'inquiry_form',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiries" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can view inquiries" ON public.inquiries FOR SELECT TO authenticated USING (true);

-- Site settings (single row, editable by staff)
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  whatsapp_number TEXT NOT NULL DEFAULT '+917303681194',
  catalogue_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.site_settings (id, whatsapp_number) VALUES ('default', '+917303681194');
