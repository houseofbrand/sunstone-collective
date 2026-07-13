import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Boxes, Clock, Download, Factory, Globe2, MessageCircle, Package, Palette, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-sunglasses.jpg";
import collectionImg from "@/assets/collection-grid.jpg";
import oemImg from "@/assets/oem-process.jpg";
import customImg from "@/assets/brand-every-detail.png";
import { categories, productPrimaryImage, type Product } from "@/lib/products";
import { listPublicProducts } from "@/lib/products.functions";
import { getFounder } from "@/lib/founder.functions";
import { FounderSection } from "@/components/site/FounderSection";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async () => ({
    products: (await listPublicProducts()) as Product[],
    founder: await getFounder(),
  }),
  component: Home,
  head: () => ({
    meta: [{ property: "og:url", content: "/" }],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const { openCatalogue, openInquiry } = useDialogs();
  const { products, founder } = Route.useLoaderData();
  const featured = products.slice(0, 4);
  return (
    <>
      {/* HERO */}
      <section className="relative bg-background border-b border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 py-16 lg:py-24 items-center">
          <div className="lg:col-span-6">
            <div className="eyebrow mb-4">India · ISO-grade Manufacturing · Worldwide Export</div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.1] text-foreground">
              OEM Sunglasses Manufacturer for Global Brands
            </h1>
            <p className="mt-5 text-secondary-foreground text-lg max-w-xl leading-relaxed">
              Launch and scale your eyewear brand with India's trusted OEM partner. Private label, custom logo, low MOQ from {SITE.moq} pieces, 15–30 day production and export to 40+ countries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => openInquiry()} className="btn-ink hover:btn-ink-hover">
                Get a Quote <ArrowRight size={16} />
              </button>
              <button onClick={() => openCatalogue()} className="btn-outline-ink hover:bg-royal hover:text-white">
                <Download size={16} /> Download Catalogue
              </button>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-lg border-t border-border pt-8">
              {[
                { k: "Minimum Order", v: "12 pcs" },
                { k: "Production", v: "15–30 days" },
                { k: "Export Reach", v: "40+ countries" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-secondary-foreground">{s.k}</dt>
                  <dd className="font-display text-2xl mt-1 text-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-card">
              <img src={heroImg} alt="Premium OEM sunglasses manufacturing" width={1600} height={1200} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>


      {/* TRUSTED */}
      <section className="border-b border-border">
        <div className="container-luxe py-8 flex flex-wrap items-center justify-between gap-6">
          <div className="eyebrow">Trusted by brands, retailers & exporters</div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-secondary-foreground font-display text-lg tracking-widest">
            {["NORTHWIND", "ATELIER 22", "SOLARE", "MERIDIAN CO.", "HORIZON WEAR", "OPTIQUE"].map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Why OEMSunglasses.com" title="Built for brands who take manufacturing seriously.">
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { icon: Factory, t: "In-house manufacturing", d: "Fully owned facility with metal, acetate and TR90 production lines. No middlemen, no markups." },
            { icon: Palette, t: "Private label & custom logo", d: "Laser engraving, pad printing, doming, metal badges, custom lens tints and packaging." },
            { icon: Boxes, t: "Low MOQ from 12 pieces", d: "Test the market first. Scale into thousands as your brand grows — same pricing structure." },
            { icon: Clock, t: "15–30 day production", d: "Streamlined sampling and mass production for fashion, sports, promotional and corporate programs." },
            { icon: Globe2, t: "Worldwide export ready", d: "Documentation, packaging and freight partners for 40+ countries including EU, US, UAE, LATAM." },
            { icon: Award, t: "Certified quality", d: "UV400 tested lenses, CE-grade materials, drop-tested frames, in-house QC on every shipment." },
          ].map((c) => (
            <div key={c.t} className="card-luxe p-7 hover:card-luxe-hover">
              <div className="w-11 h-11 rounded-md bg-secondary flex items-center justify-center text-royal">
                <c.icon size={22} />
              </div>
              <h3 className="font-display text-lg mt-5 text-foreground">{c.t}</h3>
              <p className="text-sm text-secondary-foreground mt-2 leading-relaxed">{c.d}</p>
            </div>
          ))}

        </div>
      </Section>

      <Section eyebrow="Wholesale Collections" title="A silhouette for every private label." right={<Link to="/collection" className="text-sm text-primary hover:text-blue-700 flex items-center gap-2">View all categories <ArrowRight size={14} /></Link>}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          {categories.slice(0, 8).map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group card-luxe overflow-hidden hover:card-luxe-hover">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img src={c.image} alt={c.name} loading="lazy" width={900} height={700} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-secondary-foreground">{c.short}</div>
                <div className="font-display text-base mt-1 text-foreground group-hover:text-royal transition-colors">{c.name}</div>
              </div>
            </Link>
          ))}

        </div>
      </Section>

      <section className="section-surface mt-24 border-y border-border">
        <div className="container-luxe grid lg:grid-cols-2 gap-16 py-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="eyebrow mb-4">OEM Manufacturing Process</div>
            <h2 className="font-display text-3xl md:text-4xl">From sketch to shipment — in six deliberate steps.</h2>
            <ol className="mt-10 space-y-6">
              {[
                ["Consultation", "Share your brand, quantities and reference styles."],
                ["Sampling", "3D prototype + physical sample within 7–12 days."],
                ["Approval", "Colours, materials, branding & packaging signed off."],
                ["Production", "Mass manufacturing across metal, acetate or TR90 lines."],
                ["QC & Packaging", "Every piece inspected, cleaned and boxed to spec."],
                ["Dispatch", "Worldwide door-to-door with export documentation."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5">
                  <span className="font-display text-primary text-2xl w-8">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="font-display text-lg">{t}</div>
                    <div className="text-sm text-secondary-foreground mt-0.5">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex gap-3">
              <Link to="/oem" className="btn-outline-ink hover:bg-ink hover:text-bone">Full OEM Process</Link>
              <button onClick={() => openInquiry()} className="btn-outline-ink hover:bg-ink hover:text-bone">Start OEM Project</button>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
            <img src={oemImg} alt="OEM sunglasses manufacturing" loading="lazy" width={1400} height={1000} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <FounderSection f={founder} compact />

      <Section eyebrow="Private Label & Customization" title="Every surface, brandable." right={<Link to="/customization" className="text-sm font-medium flex items-center gap-2">All customization options <ArrowRight size={14} /></Link>}>
        <div className="grid lg:grid-cols-2 gap-10 mt-10 items-center">
          <div className="aspect-[1402/1122] overflow-hidden rounded-lg border border-border shadow-card">
            <img src={customImg} alt="Sunglasses branding and logo printing options" loading="lazy" width={1402} height={1122} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Temple Logo Printing","Lens Branding","Laser Engraving","Metal Logo Badge","Hard Case Printing","Soft Pouch Printing","Cleaning Cloth","Gift Box Printing","Barcode Stickers","Custom Packaging","Custom Colours","Custom Lens Tints"].map((o) => (
              <div key={o} className="card-luxe px-4 py-3 flex items-center gap-3">
                <Sparkles className="text-gold shrink-0" size={16} />
                <span className="text-sm text-foreground">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {featured.length > 0 && (
        <Section eyebrow="Featured Products" title="Wholesale-ready silhouettes.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {featured.map((p: Product) => {
              const img = productPrimaryImage(p);
              return (
                <div key={p.code} className="card-luxe overflow-hidden flex flex-col hover:card-luxe-hover">
                  <Link to="/product/$code" params={{ code: p.code }} className="block aspect-square overflow-hidden bg-secondary">
                    {img ? (
                      <img src={img} alt={p.name} loading="lazy" width={900} height={900} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary-foreground text-xs uppercase tracking-widest">No image</div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs font-medium uppercase tracking-wider text-secondary-foreground">{p.code}</div>
                    <Link to="/product/$code" params={{ code: p.code }} className="font-display text-lg mt-1 text-foreground hover:text-royal">
                      {p.name}
                    </Link>
                    <div className="mt-2 text-sm text-secondary-foreground">MOQ {SITE.moq} pcs · Wholesale ₹{p.price}</div>
                    <div className="mt-4 flex gap-2 pt-4 border-t border-border">
                      <Link to="/product/$code" params={{ code: p.code }} className="btn-outline-ink flex-1 text-xs">View Details</Link>
                      <button onClick={() => openInquiry()} className="btn-ink flex-1 text-xs">Request Quote</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      <Section eyebrow="Industries We Serve" title="Trusted across the eyewear economy.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {["D2C Fashion Brands","Amazon & E-commerce","Optical Chains","Corporate Gifting","Promotional Agencies","Distributors & Importers","Exporters","Retail Chains"].map((i) => (
            <div key={i} className="card-luxe p-6 text-center hover:card-luxe-hover">
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-royal mx-auto">
                <Package size={18} />
              </div>
              <div className="font-medium text-sm mt-3 text-foreground">{i}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Client Testimonials" title="A partner our clients scale with.">
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            { q: "We launched our first private label collection in 6 weeks. Quality matched our reference frames from Milan.", a: "Founder, Northwind Eyewear (UK)" },
            { q: "Consistent quality across three repeat orders. Packaging and branding were exactly as approved.", a: "Category Head, Amazon Seller (US)" },
            { q: "Their sampling process is quick and their team is genuinely responsive. Ideal for corporate gifting programs.", a: "Procurement Lead, Fortune 500 (India)" },
          ].map((t) => (
            <figure key={t.a} className="card-luxe p-7">
              <div className="text-gold font-display text-4xl leading-none">"</div>
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground">{t.q}</blockquote>
              <figcaption className="text-xs font-medium uppercase tracking-wider text-secondary-foreground mt-6">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <section className="mt-24">
        <div className="container-luxe">
          <div className="bg-ink rounded-lg px-8 py-14 md:px-16 md:py-20 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Start Your Brand</div>
            <h3 className="font-display text-3xl md:text-4xl mt-3 max-w-2xl mx-auto">Ready to launch your own sunglasses line?</h3>
            <p className="mt-4 text-white/85 max-w-xl mx-auto">Speak with our OEM team for pricing, samples, and lead times tailored to your brand.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button onClick={() => openInquiry()} className="btn-ink hover:btn-ink-hover">Get a Quote</button>
              <button onClick={() => openCatalogue()} className="btn-outline-bone hover:bg-white hover:text-ink"><Download size={16} /> Download Catalogue</button>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Frequently Asked" title="Answers before you ask.">
        <div className="mt-10 grid md:grid-cols-2 gap-x-12 gap-y-2">
          {faqs.map((f) => (
            <details key={f.q} className="border-b border-border py-5 group">
              <summary className="flex justify-between items-center cursor-pointer font-display text-lg">{f.q}<span className="text-gold group-open:rotate-45 transition-transform">+</span></summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}

const faqs = [
  { q: "What is the minimum order quantity?", a: "Our MOQ is 12 pieces per style/colour for stock designs. For fully custom OEM production, MOQ starts at 100–300 pieces depending on the frame." },
  { q: "Do you offer custom logo printing?", a: "Yes — laser engraving, pad printing, doming, metal logo badges and screen printing on temples, lenses, cases, pouches and cleaning cloths." },
  { q: "How long is the production time?", a: "Stock products ship in 3–7 days. Custom OEM production runs 15–30 days depending on quantity, materials and branding." },
  { q: "Do you ship worldwide?", a: "Yes. We handle export documentation and freight to 40+ countries via sea, air and courier partners." },
  { q: "Can I get samples before placing a bulk order?", a: "Yes. Physical samples are available at nominal cost, adjusted against your first bulk order." },
  { q: "Do you support private label & white label?", a: "Absolutely. From branded temples and lenses to fully branded packaging, cases and inserts." },
];

function Section({ eyebrow, title, right, children }: { eyebrow: string; title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="container-luxe mt-24">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="max-w-2xl">
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl mt-3">{title}</h2>
          <div className="rule-gold mt-5 w-16" />
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
