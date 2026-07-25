import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  Factory,
  Globe2,
  Layers3,
  Package,
  Palette,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import heroImg from "@/assets/hero-sunglasses.jpg";
import collectionImg from "@/assets/collection-grid.jpg";
import oemImg from "@/assets/oem-process.jpg";
import customImg from "@/assets/brand-every-detail.png";
import { categories, productPrimaryImage, type Product } from "@/lib/products";
import { listPublicProducts } from "@/lib/products.functions";
import { getFounder } from "@/lib/founder.functions";
import { FounderSection } from "@/components/site/FounderSection";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async () => ({
    products: (await listPublicProducts()) as Product[],
    founder: await getFounder(),
  }),
  component: Home,
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "OEM and private-label sunglasses manufacturing partner for brands, retailers, distributors and sourcing teams. MOQ from 120 pieces, custom branding and packaging.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const { openCatalogRequest } = useDialogs();
  const { products, founder } = Route.useLoaderData();
  const featured = products.slice(0, 4);

  const discuss = (source: string) => openCatalogRequest({ category: "Sunglasses", source });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="container-luxe grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4">OEM &amp; Private Label Sunglasses Manufacturer</div>
            <h1 className="max-w-4xl font-display text-4xl leading-[1.08] md:text-5xl lg:text-[3.65rem]">
              Build Your Eyewear Brand With an Experienced Manufacturing Partner
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-secondary-foreground">
              From private-label collections to customised OEM sunglasses, we help brands,
              retailers, distributors and e-commerce businesses develop and scale eyewear programmes
              for India and international markets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                data-testid="hero-catalog-request"
                onClick={() => discuss("hero_catalogue")}
                className="btn-gold rounded-lg px-6 py-3.5"
              >
                Get OEM Catalogue <ArrowRight size={17} />
              </button>
              <button
                onClick={() => discuss("hero_project")}
                className="btn-outline-ink rounded-lg px-6 py-3.5 hover:bg-white hover:text-ink"
              >
                Discuss Your Project
              </button>
            </div>
            <div className="mt-10 flex max-w-4xl flex-wrap gap-x-6 gap-y-3 border-t border-border pt-7 text-xs font-semibold uppercase tracking-[0.12em] text-white/75">
              <span>25+ Years Industry Experience</span>
              <span>MOQ from {SITE.moq} pcs</span>
              <span>Custom Branding</span>
              <span>Custom Packaging</span>
              <span>Scalable Production</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-lifted">
              <img
                src={heroImg}
                alt="Premium sunglasses collection for OEM and private-label development"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/15 bg-[#081A32]/90 p-5 backdrop-blur">
                <div className="eyebrow text-white/65">Built to grow with your brand</div>
                <div className="mt-2 font-display text-xl">
                  From first collection to volume programmes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#081A32]">
        <div className="container-luxe grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="eyebrow">Built for brands, retailers &amp; global buyers</div>
            <h2 className="mt-3 max-w-xl font-display text-2xl md:text-3xl">
              A sourcing approach shaped around the business behind the product.
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-white/75">
            We work with fashion brands, retailers, distributors, e-commerce businesses and
            corporate buyers to develop scalable eyewear collections — from private-label programmes
            to large-volume OEM production.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Product Collections"
        title="A versatile eyewear range for distinct markets."
        description="Explore silhouettes that can form the starting point for private-label collections or a reference for customised development."
        right={
          <Link to="/collection" className="flex items-center gap-2 text-sm font-semibold">
            View all collections <ArrowRight size={15} />
          </Link>
        }
      >
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="group card-luxe overflow-hidden hover:card-luxe-hover"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  width={900}
                  height={700}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-white/60">
                  {category.short}
                </div>
                <div className="mt-1 font-display text-base">{category.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Two Ways to Build"
        title="Private label for speed. Custom OEM for differentiation."
        description="Choose the route that best fits your product brief, timing, quantity and development requirements."
      >
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="card-luxe overflow-hidden">
            <div className="grid h-full md:grid-cols-[0.9fr_1.1fr]">
              <img
                src={collectionImg}
                alt="Sunglasses assortment for private-label collections"
                loading="lazy"
                className="h-full min-h-64 w-full object-cover"
              />
              <div className="p-8">
                <div className="eyebrow">Private Label Sunglasses</div>
                <h3 className="mt-3 font-display text-2xl">
                  Launch your eyewear collection faster.
                </h3>
                <p className="mt-3 text-sm">
                  Select from existing designs and customise them with your brand identity.
                </p>
                <CapabilityList
                  items={[
                    "Logo and temple branding",
                    "Lens branding where suitable",
                    "Branded cases and pouches",
                    "Cleaning cloths and retail boxes",
                  ]}
                />
                <Link to="/customization" className="btn-gold mt-7">
                  Explore Private Label <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </article>

          <article className="card-luxe overflow-hidden">
            <div className="grid h-full md:grid-cols-[0.9fr_1.1fr]">
              <img
                src={oemImg}
                alt="Eyewear product development and finishing detail"
                loading="lazy"
                className="h-full min-h-64 w-full object-cover"
              />
              <div className="p-8">
                <div className="eyebrow">Custom OEM / ODM</div>
                <h3 className="mt-3 font-display text-2xl">
                  Develop eyewear around your brand vision.
                </h3>
                <p className="mt-3 text-sm">
                  Build a more customised programme around product references, materials, colours,
                  branding and packaging.
                </p>
                <CapabilityList
                  items={[
                    "Concept and reference review",
                    "Material and colour development",
                    "Sampling and approval",
                    "Quality control and bulk production",
                  ]}
                />
                <button onClick={() => discuss("custom_oem_pathway")} className="btn-ink mt-7">
                  Discuss Your OEM Project <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </Section>

      <section className="section-surface mt-24 border-y border-border">
        <div className="container-luxe py-24">
          <div className="max-w-3xl">
            <div className="eyebrow">Why Businesses Work With Us</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Experience, flexibility and brand-focused execution.
            </h2>
            <div className="rule-gold mt-5 w-16" />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: BriefcaseBusiness,
                title: "25+ Years of Industry Experience",
                text: "Deep experience across watches, eyewear, fashion accessories and private-label manufacturing.",
              },
              {
                icon: Layers3,
                title: "OEM & Private Label Expertise",
                text: "Solutions for established brands, retailers, distributors, start-ups and e-commerce businesses.",
              },
              {
                icon: Boxes,
                title: "Flexible Production Capability",
                text: "Support for smaller brand launches as well as large-volume production programmes.",
              },
              {
                icon: Package,
                title: "Custom Branding & Packaging",
                text: "Products, logos, cases, pouches, cleaning cloths and retail packaging developed as one programme.",
              },
              {
                icon: Globe2,
                title: "India & Global Business Focus",
                text: "A B2B approach designed for domestic buyers and international sourcing requirements.",
              },
            ].map((item) => (
              <article key={item.title} className="card-luxe p-6">
                <item.icon size={22} className="text-primary" />
                <h3 className="mt-5 font-display text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Section
        eyebrow="From Development to Production"
        title="A closer look at the product journey."
        description="Product selection, development details, branding and finishing are reviewed as connected parts of the final eyewear programme."
      >
        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <figure className="group relative overflow-hidden rounded-2xl border border-border lg:col-span-7">
            <img
              src={oemImg}
              alt="Eyewear product review and finishing"
              loading="lazy"
              className="h-full min-h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081A32] to-transparent p-7 pt-20 font-semibold">
              Product development and finishing review
            </figcaption>
          </figure>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <figure className="relative overflow-hidden rounded-2xl border border-border">
              <img
                src={collectionImg}
                alt="Eyewear collection assortment"
                loading="lazy"
                className="h-full min-h-48 w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[#081A32]/90 px-5 py-3 text-sm font-semibold">
                Collection and design selection
              </figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-2xl border border-border">
              <img
                src={customImg}
                alt="Sunglasses logo and branding placement options"
                loading="lazy"
                className="h-full min-h-48 w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[#081A32]/90 px-5 py-3 text-sm font-semibold">
                Branding placement and packaging planning
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Private Label & Customisation"
        title="Your Brand. Every Detail."
        description="From the frame to the packaging, build a complete eyewear collection around your brand identity."
        right={
          <Link to="/customization" className="flex items-center gap-2 text-sm font-semibold">
            Explore all options <ArrowRight size={15} />
          </Link>
        }
      >
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <img
              src={customImg}
              alt="Your brand on sunglasses frames, temples and packaging"
              loading="lazy"
              width={1402}
              height={1122}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Frame", "Custom colours and finishes"],
              ["Temple", "Printed, engraved or applied logo options"],
              ["Lens", "Branding where technically suitable"],
              ["Metal Details", "Logo badges and decorative components"],
              ["Case", "Custom branded protective cases"],
              ["Pouch", "Private-label pouches"],
              ["Cleaning Cloth", "Custom logo printing"],
              ["Retail Box", "Complete branded packaging"],
            ].map(([title, text]) => (
              <div key={title} className="card-luxe p-5">
                <Sparkles className="text-primary" size={17} />
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.14em]">{title}</div>
                <p className="mt-1 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <section className="section-surface mt-24 border-y border-border">
        <div className="container-luxe grid items-center gap-14 py-24 lg:grid-cols-2">
          <div>
            <div className="eyebrow">Quality at Every Stage</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Quality managed through development, production and final inspection.
            </h2>
            <p className="mt-5 max-w-2xl">
              Our approach focuses on product consistency, finishing, functionality and packaging
              before dispatch.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                "Lens inspection",
                "Frame and finish inspection",
                "Hinge and temple alignment",
                "Logo placement inspection",
                "Colour consistency review",
                "Packaging inspection",
                "Random production checks",
                "Final pre-dispatch inspection",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-2 rounded-lg border border-border bg-card p-4 text-sm"
                >
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-[#081A32] p-8 md:p-10">
            <ShieldCheck size={36} className="text-primary" />
            <h3 className="mt-6 font-display text-2xl">A practical QC framework</h3>
            <p className="mt-4 text-sm">
              Inspection requirements are aligned with the approved product, branding and packaging
              specifications. Product-specific testing or market compliance requirements should be
              agreed during development.
            </p>
            <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60">
              Certification logos and claims are displayed only when the applicable supporting
              documentation is available.
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="OEM Development Process"
        title="A clear path from brief to bulk production."
        description="The exact development route depends on the design, material, branding, packaging and volume requirements."
      >
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Concept / Reference",
              "Share product references, market positioning and commercial requirements.",
            ],
            ["Design Selection", "Define the product route and shortlist suitable silhouettes."],
            ["Material & Colour", "Align the frame, lens, finish and colour direction."],
            ["Branding", "Confirm logo position, technique and artwork specifications."],
            ["Sampling", "Review product, branding and packaging samples before production."],
            ["Packaging", "Finalise cases, pouches, cloths, boxes and retail presentation."],
            ["Quality Control", "Inspect against approved product and packaging requirements."],
            ["Bulk Production", "Plan production and dispatch around the agreed programme."],
          ].map(([title, text], index) => (
            <li key={title} className="card-luxe p-6">
              <span className="font-display text-3xl text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <section className="mt-24 bg-[#081A32]">
        <div className="container-luxe grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="eyebrow">From First Collection to Large-Scale Production</div>
            <h2 className="mt-3 max-w-4xl font-display text-3xl md:text-5xl">
              An experienced global eyewear manufacturing partner for changing sourcing needs.
            </h2>
            <p className="mt-6 max-w-3xl">
              Whether you are launching your first eyewear collection or sourcing at scale, our
              approach is built around your product, quantity, branding and commercial requirements.
            </p>
            <p className="mt-4 max-w-3xl text-sm text-white/65">
              From 100-piece opportunities to 100,000-piece programmes, different businesses require
              different sourcing solutions. Our focus is to build long-term manufacturing
              relationships that can grow with the brand.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-7">
              <div className="eyebrow">Displayed Starting MOQ</div>
              <div className="mt-2 font-display text-4xl">From {SITE.moq} pcs</div>
              <p className="mt-3 text-sm">For suitable products and private-label programmes.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-7 text-sm text-white/70">
              MOQ varies by product, design, material and customisation. Fully customised OEM
              developments may require a higher starting quantity.
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <Section
          eyebrow="Selected Products"
          title="Product-first sourcing, without retail-style pricing."
          description="Final pricing is quoted against quantity, materials, branding, packaging and customisation requirements."
        >
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => {
              const image = productPrimaryImage(product);
              return (
                <article key={product.code} className="card-luxe flex flex-col overflow-hidden">
                  <Link
                    to="/product/$code"
                    params={{ code: product.code }}
                    className="block aspect-square overflow-hidden bg-secondary"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs uppercase tracking-widest text-white/50">
                        Image coming soon
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="eyebrow">{product.code}</div>
                    <Link
                      to="/product/$code"
                      params={{ code: product.code }}
                      className="mt-1 font-display text-lg"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-2 text-xs">
                      {[product.frame_material, product.lens_material].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
                      <div>MOQ from {SITE.moq} pcs</div>
                      <div>Private label available</div>
                      <div>Custom branding available</div>
                    </div>
                    <button
                      onClick={() => discuss(`featured_product:${product.code}`)}
                      className="btn-ink mt-5 w-full text-xs"
                    >
                      Get OEM Price
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>
      )}

      <Section
        eyebrow="Businesses We Serve"
        title="Built for professional eyewear sourcing."
        description="Product and programme requirements are shaped around the buyer, channel and target market."
      >
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[
            "Fashion Brands",
            "Eyewear Brands",
            "D2C Brands",
            "E-commerce Sellers",
            "Retail Chains",
            "Distributors",
            "Importers",
            "Corporate Buyers",
            "Buying Houses",
            "International Sourcing Teams",
          ].map((business) => (
            <div key={business} className="card-luxe p-6 text-center">
              <Factory className="mx-auto text-primary" size={19} />
              <div className="mt-3 text-sm font-semibold">{business}</div>
            </div>
          ))}
        </div>
      </Section>

      <FounderSection f={founder} compact />

      <Section eyebrow="Frequently Asked" title="Answers for sourcing teams and brand owners.">
        <div className="mt-10 grid gap-x-12 gap-y-2 md:grid-cols-2">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-border py-5">
              <summary className="flex cursor-pointer items-center justify-between font-display text-lg">
                {faq.question}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="mt-24">
        <div className="container-luxe">
          <div className="rounded-2xl border border-white/10 bg-[#081A32] px-8 py-14 text-center md:px-16 md:py-20">
            <ScanSearch className="mx-auto text-primary" size={30} />
            <div className="eyebrow mt-5">Start an OEM Enquiry</div>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl md:text-4xl">
              Tell us what you want to build.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl">
              Share your product, quantity, branding and packaging requirements. Our team will
              review the brief and respond with the most relevant next steps.
            </p>
            <button onClick={() => discuss("home_final_cta")} className="btn-gold mt-8">
              Submit OEM Enquiry <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

const faqs = [
  {
    question: "What is the minimum order quantity?",
    answer:
      "The displayed starting MOQ is 120 pieces for suitable products and private-label programmes. The applicable MOQ depends on the product, design, material, branding and customisation requirements; fully customised OEM development may require a higher quantity.",
  },
  {
    question: "What is the difference between private label and custom OEM?",
    answer:
      "Private label starts with an existing product design and adds your brand identity and packaging. Custom OEM involves a more detailed development brief covering product references, materials, colours, components, branding, sampling and packaging.",
  },
  {
    question: "Can you create branded packaging?",
    answer:
      "Yes. Packaging options can include cases, pouches, cleaning cloths, retail boxes, inserts and labelling, subject to the selected product and programme requirements.",
  },
  {
    question: "How is product quality managed?",
    answer:
      "Quality requirements are reviewed through development, production checks and final inspection, focusing on frame and lens condition, finishing, functionality, logo execution, colour consistency and packaging.",
  },
  {
    question: "Can you support both growing brands and large-volume buyers?",
    answer:
      "Yes. The sourcing approach is planned around the product, quantity and customisation scope, from first collections to larger repeat or volume programmes.",
  },
  {
    question: "Can I submit a design or reference image?",
    answer:
      "Yes. The OEM enquiry form accepts an optional design or reference image so the team can review your direction together with the written brief.",
  },
];

function CapabilityList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-white/75">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Section({
  eyebrow,
  title,
  description,
  right,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="container-luxe mt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{title}</h2>
          {description && <p className="mt-4 max-w-2xl text-sm leading-relaxed">{description}</p>}
          <div className="rule-gold mt-5 w-16" />
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
