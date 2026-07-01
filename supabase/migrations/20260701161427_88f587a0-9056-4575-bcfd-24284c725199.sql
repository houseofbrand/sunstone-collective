
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Catalogues
CREATE TABLE public.catalogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_url TEXT,
  file_size BIGINT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.catalogues TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.catalogues TO authenticated;
GRANT ALL ON public.catalogues TO service_role;
ALTER TABLE public.catalogues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active catalogues" ON public.catalogues FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert catalogues" ON public.catalogues FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update catalogues" ON public.catalogues FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete catalogues" ON public.catalogues FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_catalogues_updated_at BEFORE UPDATE ON public.catalogues
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Download events
CREATE TABLE public.catalogue_download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalogue_id UUID REFERENCES public.catalogues(id) ON DELETE SET NULL,
  catalogue_slug TEXT,
  lead_id UUID REFERENCES public.catalogue_downloads(id) ON DELETE SET NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.catalogue_download_events TO anon, authenticated;
GRANT SELECT ON public.catalogue_download_events TO authenticated;
GRANT ALL ON public.catalogue_download_events TO service_role;
ALTER TABLE public.catalogue_download_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log download events" ON public.catalogue_download_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view download events" ON public.catalogue_download_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_cde_created ON public.catalogue_download_events (created_at DESC);
CREATE INDEX idx_cde_catalogue ON public.catalogue_download_events (catalogue_id);

-- Tighten leads visibility to admins only
DROP POLICY IF EXISTS "Authenticated can view downloads" ON public.catalogue_downloads;
DROP POLICY IF EXISTS "Authenticated can view inquiries" ON public.inquiries;
CREATE POLICY "Admins can view downloads" ON public.catalogue_downloads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view inquiries" ON public.inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
