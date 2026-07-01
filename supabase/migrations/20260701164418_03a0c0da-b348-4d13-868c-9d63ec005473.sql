
ALTER TABLE public.catalogues ADD COLUMN IF NOT EXISTS category_slug text;
ALTER TABLE public.catalogues ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS catalogues_only_one_primary ON public.catalogues ((true)) WHERE is_primary = true;
ALTER TABLE public.catalogue_download_events ADD COLUMN IF NOT EXISTS ip_address text;
