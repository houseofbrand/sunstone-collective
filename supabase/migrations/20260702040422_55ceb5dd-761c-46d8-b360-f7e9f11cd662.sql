
-- 1) Move has_role() out of the public/API-exposed schema
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate policies that previously referenced public.has_role to use private.has_role
-- user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- catalogues
DROP POLICY IF EXISTS "Public can view active catalogues" ON public.catalogues;
CREATE POLICY "Public can view active catalogues" ON public.catalogues
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert catalogues" ON public.catalogues;
CREATE POLICY "Admins can insert catalogues" ON public.catalogues
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update catalogues" ON public.catalogues;
CREATE POLICY "Admins can update catalogues" ON public.catalogues
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete catalogues" ON public.catalogues;
CREATE POLICY "Admins can delete catalogues" ON public.catalogues
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- catalogue_download_events
DROP POLICY IF EXISTS "Admins can view download events" ON public.catalogue_download_events;
CREATE POLICY "Admins can view download events" ON public.catalogue_download_events
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- catalogue_downloads
DROP POLICY IF EXISTS "Admins can view downloads" ON public.catalogue_downloads;
CREATE POLICY "Admins can view downloads" ON public.catalogue_downloads
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- inquiries
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
CREATE POLICY "Admins can view inquiries" ON public.inquiries
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- products
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- product_images
DROP POLICY IF EXISTS "Admins can insert product images" ON public.product_images;
CREATE POLICY "Admins can insert product images" ON public.product_images
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update product images" ON public.product_images;
CREATE POLICY "Admins can update product images" ON public.product_images
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete product images" ON public.product_images;
CREATE POLICY "Admins can delete product images" ON public.product_images
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- founder_profile
DROP POLICY IF EXISTS "Admins can insert founder" ON public.founder_profile;
CREATE POLICY "Admins can insert founder" ON public.founder_profile
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update founder" ON public.founder_profile;
CREATE POLICY "Admins can update founder" ON public.founder_profile
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- storage.objects admin policies (recreate to use private.has_role)
DROP POLICY IF EXISTS "Admins manage catalogue files" ON storage.objects;
CREATE POLICY "Admins manage catalogue files" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'catalogues' AND private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'catalogues' AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update product images storage" ON storage.objects;
CREATE POLICY "Admins can update product images storage" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete product images storage" ON storage.objects;
CREATE POLICY "Admins can delete product images storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Now safe to drop the public wrapper
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 2) Replace overly-permissive WITH CHECK (true) policies with input validation
DROP POLICY IF EXISTS "Anyone can submit downloads" ON public.catalogue_downloads;
CREATE POLICY "Anyone can submit downloads" ON public.catalogue_downloads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 200
    AND char_length(trim(email)) BETWEEN 3 AND 200
    AND email LIKE '%_@_%.__%'
    AND char_length(trim(mobile)) BETWEEN 5 AND 30
    AND char_length(trim(company)) BETWEEN 1 AND 200
    AND char_length(trim(city)) BETWEEN 1 AND 100
    AND char_length(trim(country)) BETWEEN 1 AND 100
  );

DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiries" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 200
    AND char_length(trim(email)) BETWEEN 3 AND 200
    AND email LIKE '%_@_%.__%'
    AND char_length(trim(mobile)) BETWEEN 5 AND 30
    AND (message IS NULL OR char_length(message) <= 5000)
  );

DROP POLICY IF EXISTS "Anyone can log download events" ON public.catalogue_download_events;
CREATE POLICY "Anyone can log download events" ON public.catalogue_download_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (catalogue_id IS NOT NULL OR (catalogue_slug IS NOT NULL AND char_length(catalogue_slug) BETWEEN 1 AND 200))
    AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
    AND (referrer IS NULL OR char_length(referrer) <= 2000)
  );

-- 3) Storage SELECT policies for admins on private buckets
DROP POLICY IF EXISTS "Admins can read catalogue files" ON storage.objects;
CREATE POLICY "Admins can read catalogue files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'catalogues' AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can read product images" ON storage.objects;
CREATE POLICY "Admins can read product images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
