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

export type Product = {
  code: string;
  name: string;
  category: string; // slug
  price: number; // wholesale INR
  colours: string[];
  frameMaterial: string;
  lensMaterial: string;
  weight: string;
  image: string;
};

export const products: Product[] = [
  { code: "OEM-AV-101", name: "Blakely Aviator", category: "aviator", price: 249, colours: ["Matte Gold", "Gunmetal", "Rose Gold", "Black"], frameMaterial: "Alloy Metal", lensMaterial: "TAC Polarized UV400", weight: "28g", image: aviator },
  { code: "OEM-AV-108", name: "Marconi Pilot", category: "aviator", price: 279, colours: ["Gold/Brown", "Silver/Grey"], frameMaterial: "Stainless Steel", lensMaterial: "CR-39 UV400", weight: "31g", image: aviator },
  { code: "OEM-RD-204", name: "Atelier Round", category: "round", price: 229, colours: ["Gold", "Silver", "Black", "Tortoise"], frameMaterial: "Metal + Acetate Tip", lensMaterial: "AC Lens UV400", weight: "26g", image: round },
  { code: "OEM-SQ-312", name: "Milano Square", category: "square", price: 289, colours: ["Tortoise", "Black", "Amber", "Crystal"], frameMaterial: "Italian Acetate", lensMaterial: "Nylon UV400", weight: "34g", image: square },
  { code: "OEM-CE-408", name: "Fray Cat Eye", category: "cat-eye", price: 269, colours: ["Black/Gold", "Ivory", "Tortoise"], frameMaterial: "Acetate", lensMaterial: "TAC UV400", weight: "30g", image: cateye },
  { code: "OEM-SP-511", name: "Vector Sport Wrap", category: "sports", price: 219, colours: ["Matte Black", "Navy", "White"], frameMaterial: "TR90", lensMaterial: "PC Polarized UV400", weight: "24g", image: sport },
  { code: "OEM-PL-609", name: "Polaris Wayfarer", category: "polarized", price: 259, colours: ["Black/Gold", "Tortoise/Green"], frameMaterial: "TR90 + Metal Bridge", lensMaterial: "TAC Polarized UV400", weight: "27g", image: polarized },
  { code: "OEM-DR-702", name: "Nightline Driver", category: "driving", price: 299, colours: ["Yellow HD", "Grey Polarized"], frameMaterial: "TR90", lensMaterial: "HD Polarized UV400", weight: "25g", image: polarized },
];

export const featuredCodes = ["OEM-AV-101", "OEM-CE-408", "OEM-SQ-312", "OEM-SP-511"];

export const findProduct = (code: string) => products.find((p) => p.code === code);
export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsByCategory = (slug: string) => {
  const catNames = new Set([slug]);
  return products.filter((p) => catNames.has(p.category) || (slug === "men" && ["aviator", "square", "sports", "polarized"].includes(p.category)) || (slug === "women" && ["cat-eye", "round"].includes(p.category)));
};
