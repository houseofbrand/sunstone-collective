export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: number;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-start-your-own-sunglasses-brand",
    title: "How to start your own sunglasses brand in 2026",
    category: "Brand Building",
    excerpt:
      "A practical, step-by-step guide to launching a private label sunglasses brand — from positioning and MOQ decisions to first orders.",
    readTime: 8,
    body: [
      "A clear product position, sourcing brief and commercial plan are the foundation of a successful sunglasses launch. Start by defining the customer, channel, assortment and level of custom development required.",
      "## Step 1 — Define your positioning",
      "Are you a fashion-forward D2C, a specialist in polarized sports eyewear, or a niche cat-eye label for a specific audience? Positioning determines silhouettes, price point, packaging tone and channel.",
      "## Step 2 — Lock a price point and MOQ",
      "Pricing depends on the product, material, lens, quantity, branding and packaging brief. MOQ: 120 pcs (Mix up to 10 models, minimum 12 pcs per model/colour).",
      "## Step 3 — Choose stock vs OEM",
      "Private-label programmes can reduce development complexity by starting from an existing frame. Custom OEM development requires more detailed product, material, sampling and approval planning.",
      "## Step 4 — Sampling, approval, production",
      "Review a physical sample where appropriate. Approve colour, hinge action, lens tint, branding and packaging before confirming bulk production.",
    ],
  },
  {
    slug: "oem-vs-private-label-vs-white-label",
    title: "OEM vs Private Label vs White Label — what's the difference?",
    category: "Manufacturing",
    excerpt:
      "The terms get used interchangeably. They shouldn't. Here's how OEM, private label and white label differ in eyewear manufacturing.",
    readTime: 5,
    body: [
      "The three terms describe overlapping but distinct manufacturing relationships. Getting them right helps you negotiate better and set expectations internally.",
      "## OEM (Original Equipment Manufacturer)",
      "You bring the product direction, materials and specification. The manufacturer develops against the agreed brief. This route usually involves more development work and a higher MOQ than private label.",
      "## Private Label",
      "You choose from an existing range of frames and add your branding — logo on temples, suitable lens options and branded packaging. MOQ: 120 pcs (Mix up to 10 models, minimum 12 pcs per model/colour).",
      "## White Label",
      "Similar to private label but the frame itself is unbranded and generic — you're essentially reselling a neutral product with your logo. Common in promotional and gifting programs.",
    ],
  },
  {
    slug: "wholesale-sunglasses-buying-guide",
    title: "The wholesale sunglasses buying guide",
    category: "Buyer Guide",
    excerpt:
      "What to look for when sourcing wholesale sunglasses — materials, lens quality, MOQ, packaging and payment terms.",
    readTime: 6,
    body: [
      "Wholesale sourcing is not just about price. Consistency, lens quality and after-sale support decide whether your second order goes to the same supplier.",
      "## Materials that matter",
      "Material selection affects weight, feel, finish, durability and commercial positioning. Ask for product specifications and the supporting documentation relevant to your target market.",
      "## Lens standards",
      "Lens and product requirements vary by market and use case. Agree the specification and request the applicable testing or compliance documentation before placing a production order.",
      "## Packaging and shipping",
      "Packaging should be selected around the product, channel and target market. Confirm cases, pouches, retail boxes, barcodes, labelling and shipping-carton requirements up front.",
    ],
  },
  {
    slug: "custom-logo-printing-methods",
    title: "Custom logo printing methods for sunglasses — a comparison",
    category: "Customization",
    excerpt:
      "Laser engraving, pad printing, doming, screen printing — a quick guide to which method suits your brand.",
    readTime: 4,
    body: [
      "The right printing method depends on your logo, material and durability expectations.",
      "## Laser Engraving",
      "Permanent, precise, monochrome. Ideal on metal temples and acetate. Premium feel.",
      "## Pad Printing",
      "Full colour, cost-effective, works on curved surfaces. Slight risk of wear over years of use.",
      "## Doming Stickers",
      "3D resin-coated logos. Vibrant, tactile, budget-friendly. Best on flat inner temple areas.",
      "## Metal Badges",
      "Screwed or riveted metal plates. Ultra-premium. Common on luxury acetate frames.",
    ],
  },
  {
    slug: "promotional-sunglasses-for-events",
    title: "Best promotional sunglasses for corporate events",
    category: "Promotional",
    excerpt:
      "From music festivals to conferences and trade shows — what to look for when ordering promotional sunglasses.",
    readTime: 4,
    body: [
      "Promotional sunglasses can combine practical utility with visible brand placement when the product and presentation suit the audience.",
      "## Silhouette",
      "Wayfarer and aviator have the broadest appeal across audiences. Sport wraps work best for outdoor and athletic events.",
      "## Branding",
      "Pad-printed logos on temples are the sweet spot for cost and visibility. Custom lens colours add uniqueness.",
      "## Packaging",
      "Even a printed pouch dramatically extends the product's life beyond day one of the event.",
    ],
  },
  {
    slug: "latest-sunglasses-trends-2026",
    title: "Latest sunglasses trends brands should stock in 2026",
    category: "Trends",
    excerpt:
      "Editorial round, sculpted cat eyes, tinted micro-lenses, chunky '90s acetate — the silhouettes shaping this season.",
    readTime: 5,
    body: [
      "Every season brings a new dominant silhouette. Here's what's moving on runways and DTC storefronts this year.",
      "## Editorial Round",
      "Fine metal, subtly oversized. Ideal for premium D2C labels.",
      "## Sculpted Cat Eye",
      "Bold acetate with metallic hinge detailing. Big in premium women's collections.",
      "## Tinted Micro-Lenses",
      "Small oval and rectangular frames with warm-tinted lenses — Y2K-inflected, TikTok-native.",
      "## Chunky '90s Acetate",
      "Tortoise and translucent chunky wayfarers continue strong in men's fashion.",
    ],
  },
];

export const findPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
