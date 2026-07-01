import aviator from "@/assets/prod-aviator.jpg";
import round from "@/assets/prod-round.jpg";
import square from "@/assets/prod-square.jpg";
import cateye from "@/assets/prod-cateye.jpg";
import sport from "@/assets/prod-sport.jpg";
import polarized from "@/assets/prod-polarized.jpg";

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
};

export const categories: Category[] = [
  { slug: "aviator", name: "Aviator Sunglasses", short: "Timeless pilot silhouettes", description: "Classic teardrop aviators in metal and titanium — OEM ready with custom lens tints and temple engraving.", image: aviator },
  { slug: "round", name: "Round Sunglasses", short: "Editorial round frames", description: "Round metal and acetate frames for fashion-forward private label collections.", image: round },
  { slug: "square", name: "Square Sunglasses", short: "Architectural acetate", description: "Bold square acetate frames — tortoise, matte, glossy finishes and custom hinge branding.", image: square },
  { slug: "cat-eye", name: "Cat Eye Sunglasses", short: "Sculpted feminine lines", description: "Retro-inspired cat eyes in premium acetate with metal accents for luxury women's lines.", image: cateye },
  { slug: "sports", name: "Sports Sunglasses", short: "Wrap performance", description: "TR90 and polycarbonate wrap frames for athletic brands, cycling and driving programs.", image: sport },
  { slug: "polarized", name: "Polarized Sunglasses", short: "Glare-free clarity", description: "TAC polarized lenses with UV400 — available across every silhouette in our OEM range.", image: polarized },
  { slug: "men", name: "Men's Sunglasses", short: "The complete men's range", description: "Aviator, wayfarer, sport and square silhouettes engineered for men's collections.", image: aviator },
  { slug: "women", name: "Women's Sunglasses", short: "Feminine luxury", description: "Cat eye, oversized, round and butterfly frames designed for premium women's labels.", image: cateye },
  { slug: "kids", name: "Kids Sunglasses", short: "Flexible and safe", description: "TR90 flexible frames with UV400 protection — bright colours and safety-tested for children.", image: round },
  { slug: "luxury", name: "Luxury Collection", short: "Titanium and acetate", description: "Our flagship line — Italian acetate, Japanese titanium, gold and rhodium plating.", image: square },
  { slug: "corporate-gift", name: "Corporate Gift Sunglasses", short: "Branded gifting", description: "Custom-printed pouches, gift boxes and temple logos for corporate gifting programs.", image: polarized },
  { slug: "promotional", name: "Promotional Sunglasses", short: "Event & campaign", description: "Ultra low-cost customised sunglasses for events, promotions and giveaways from 100 pieces.", image: sport },
  { slug: "driving", name: "Driving Sunglasses", short: "HD polarized drive", description: "Anti-glare polarized night and day driving sunglasses with custom brand printing.", image: polarized },
  { slug: "fashion", name: "Fashion Sunglasses", short: "Trend-forward silhouettes", description: "Seasonal drops inspired by Milan and Paris runways — perfect for D2C fashion brands.", image: cateye },
  { slug: "premium", name: "Premium Collection", short: "Signature private label", description: "Our most requested private label frames with premium packaging included.", image: aviator },
];

export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);

export type ProductImage = {
  id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
  alt_text: string | null;
};

export type Product = {
  id: string;
  code: string;
  name: string;
  category_slug: string;
  price: number;
  colours: string[];
  frame_material: string;
  lens_material: string;
  weight: string;
  description: string | null;
  sort_order: number;
  images: ProductImage[];
};

export const productPrimaryImage = (p: Pick<Product, "images">) =>
  p.images.find((i) => i.is_primary)?.url || p.images[0]?.url || null;

/** Categories that group multiple silhouettes together. */
const groupCategoryMap: Record<string, string[]> = {
  men: ["aviator", "square", "sports", "polarized"],
  women: ["cat-eye", "round"],
};

export const productsByCategory = (all: Product[], slug: string) => {
  const group = groupCategoryMap[slug];
  return all.filter((p) => (group ? group.includes(p.category_slug) : p.category_slug === slug));
};
