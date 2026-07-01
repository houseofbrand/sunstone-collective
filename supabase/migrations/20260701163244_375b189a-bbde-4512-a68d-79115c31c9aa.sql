
-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  colours TEXT[] NOT NULL DEFAULT '{}',
  frame_material TEXT NOT NULL DEFAULT '',
  lens_material TEXT NOT NULL DEFAULT '',
  weight TEXT NOT NULL DEFAULT '',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX products_category_idx ON public.products(category_slug);
CREATE INDEX products_sort_idx ON public.products(sort_order);

-- PRODUCT IMAGES
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert product images"
  ON public.product_images FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
  ON public.product_images FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
  ON public.product_images FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX product_images_product_idx ON public.product_images(product_id);

-- Ensure only one primary image per product
CREATE UNIQUE INDEX product_images_one_primary
  ON public.product_images(product_id) WHERE is_primary = true;

-- STORAGE POLICIES for product-images bucket
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- SEED existing products
INSERT INTO public.products (code, name, category_slug, price, colours, frame_material, lens_material, weight, sort_order) VALUES
('OEM-AV-101', 'Blakely Aviator', 'aviator', 249, ARRAY['Matte Gold','Gunmetal','Rose Gold','Black'], 'Alloy Metal', 'TAC Polarized UV400', '28g', 10),
('OEM-AV-108', 'Marconi Pilot', 'aviator', 279, ARRAY['Gold/Brown','Silver/Grey'], 'Stainless Steel', 'CR-39 UV400', '31g', 20),
('OEM-RD-204', 'Atelier Round', 'round', 229, ARRAY['Gold','Silver','Black','Tortoise'], 'Metal + Acetate Tip', 'AC Lens UV400', '26g', 30),
('OEM-SQ-312', 'Milano Square', 'square', 289, ARRAY['Tortoise','Black','Amber','Crystal'], 'Italian Acetate', 'Nylon UV400', '34g', 40),
('OEM-CE-408', 'Fray Cat Eye', 'cat-eye', 269, ARRAY['Black/Gold','Ivory','Tortoise'], 'Acetate', 'TAC UV400', '30g', 50),
('OEM-SP-511', 'Vector Sport Wrap', 'sports', 219, ARRAY['Matte Black','Navy','White'], 'TR90', 'PC Polarized UV400', '24g', 60),
('OEM-PL-609', 'Polaris Wayfarer', 'polarized', 259, ARRAY['Black/Gold','Tortoise/Green'], 'TR90 + Metal Bridge', 'TAC Polarized UV400', '27g', 70),
('OEM-DR-702', 'Nightline Driver', 'driving', 299, ARRAY['Yellow HD','Grey Polarized'], 'TR90', 'HD Polarized UV400', '25g', 80);
