
CREATE TABLE public.founder_profile (
  id text PRIMARY KEY DEFAULT 'default',
  name text NOT NULL DEFAULT 'Rajan Mehta',
  designation text NOT NULL DEFAULT 'Founder & CEO',
  bio text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '/founder/rajan.jpg',
  website_url text NOT NULL DEFAULT 'https://www.rajanmehta.in',
  linkedin_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  youtube_url text NOT NULL DEFAULT '',
  achievements jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.founder_profile TO anon, authenticated;
GRANT ALL ON public.founder_profile TO service_role;

ALTER TABLE public.founder_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read founder" ON public.founder_profile FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update founder" ON public.founder_profile FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert founder" ON public.founder_profile FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_founder_profile_updated_at BEFORE UPDATE ON public.founder_profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.founder_profile (id, name, designation, bio, quote, achievements, linkedin_url, instagram_url, facebook_url, youtube_url) VALUES (
  'default',
  'Rajan Mehta',
  'Founder & CEO',
  E'With 25+ years at the helm of the global fashion accessories industry, Rajan Mehta has built a formidable reputation as an architect of modern retail and a pioneer of private label manufacturing.\n\nHis expertise spans OEM manufacturing, product sourcing, branding and international business across sunglasses, watches, wallets, belts, perfumes and lifestyle accessories. He has partnered with global legacy brands including Maxima, Timex, Danish Design, Jacob Jensen, Lee Cooper and Kappa, and defined the private label landscape for India''s premier fashion ecosystems — Roadster, Wrogn, House of Pataudi, Dressberry and Mast & Harbour.\n\nToday, through House of Brands and OEMSunglasses.com, Rajan helps brands, retailers, startups, influencers and entrepreneurs launch their own branded product lines with world-class manufacturing infrastructure across key Asian markets.',
  'We build brands and products with a point of view — bridging international craftsmanship with the ambitions of every entrepreneur we partner with.',
  '[
    {"value":"25+","label":"Years of Industry Experience"},
    {"value":"10M+","label":"Products Delivered Globally"},
    {"value":"800+","label":"Product Lines Developed"},
    {"value":"03","label":"International Offices"},
    {"value":"40+","label":"Countries Served"},
    {"value":"100%","label":"OEM & Private Label Focus"}
  ]'::jsonb,
  'https://www.linkedin.com/in/rajanmehta',
  'https://www.instagram.com/rajanmehta',
  'https://www.facebook.com/rajanmehta',
  'https://www.youtube.com/@rajanmehta'
) ON CONFLICT (id) DO NOTHING;
