import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Boxes, Clock, Download, Factory, Globe2, MessageCircle, Package, Palette, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-sunglasses.jpg";
import collectionImg from "@/assets/collection-grid.jpg";
import oemImg from "@/assets/oem-process.jpg";
import customImg from "@/assets/customization.jpg";
import { categories, productPrimaryImage, type Product } from "@/lib/products";
import { listPublicProducts } from "@/lib/products.functions";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async () => ({ products: (await listPublicProducts()) as Product[] }),
  component: Home,
  head: () => ({
    meta: [{ property: "og:url", content: "/" }],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const { openCatalogue, openInquiry } = useDialogs();
  const { products } = Route.useLoaderData();
  const featured = products.slice(0, 4);
  return (
    <>
      {/* HERO */}
      <section className="relative bg-ink text-bone overflow-hidden">
        <div className="container-luxe grid lg:grid-cols-12 gap-10 py-20 lg:py-28 items-center">
          <div className="lg:col-span-6">
            <div className="eyebrow text-gold mb-5">India · Est. Manufacturing · Worldwide Export</div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              OEM Sunglasses Manufacturer.<br />
              <span className="text-gold italic font-normal">Private Label</span> & Wholesale Supplier.
            </h1>
            <p className="mt-6 text-bone/75 max-w-xl leading-relaxed">
              Launch your own sunglasses brand with India's trusted OEM partner. Low MOQ from {SITE.moq} pieces, custom logo, private label, fast production and worldwide shipping.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/collection" className="btn-gold hover:brightness-95">Browse Collection <ArrowRight size={14} /></Link>
              <button onClick={openCatalogue} className="btn-outline-bone hover:bg-bone hover:text-ink"><Download size={14} /> Download Catalogue</button>
              <button onClick={() => openInquiry()} className="btn-outline-bone hover:bg-bone hover:text-ink">Get OEM Quote</button>
              <a href={waLink("Hello, I'd like to discuss OEM sunglasses.")} target="_blank" rel="noreferrer" className="btn-outline-bone hover:bg-bone hover:text-ink"><MessageCircle size={14} /> WhatsApp</a>
            </div>
            <dl className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { k: "MOQ", v: "12 pcs" },
                { k: "Production", v: "15–30 days" },
                { k: "Export", v: "40+ countries" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="eyebrow text-bone/50">{s.k}</dt>
                  <dd className="font-display text-2xl mt-1 text-gold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={heroImg} alt="Premium OEM aviator sunglasses" width={1600} height={1200} className="w-full h-full object-cover" />
              <div className="absolute -bottom-1 -right-1 bg-bone text-ink px-5 py-3 border-l border-t border-gold">
                <div className="eyebrow text-muted-foreground">Featured</div>
                <div className="font-display text-lg leading-tight">India's Trusted OEM Partner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED */}
      <section className="border-b border-border">
        <div className="container-luxe py-8 flex flex-wrap items-center justify-between gap-6">
          <div className="eyebrow">Trusted by brands, retailers & exporters</div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-ink/60 font-display text-lg tracking-widest">
            {["NORTHWIND", "ATELIER 22", "SOLARE", "MERIDIAN CO.", "HORIZON WEAR", "OPTIQUE"].map((b) => (
              <span key={b} className="opacity-60">{b}</span>
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
            <div key={c.t} className="group border border-border p-7 bg-card hover:border-gold transition-colors">
              <c.icon className="text-gold" size={26} />
              <h3 className="font-display text-xl mt-5">{c.t}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Wholesale Collections" title="A silhouette for every private label." right={<Link to="/collection" className="text-sm hover:text-gold flex items-center gap-2">View all categories <ArrowRight size={14} /></Link>}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          {categories.slice(0, 8).map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group block relative overflow-hidden bg-secondary aspect-[3/4]">
              <img src={c.image} alt={c.name} loading="lazy" width={900} height={1200} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-bone">
                <div className="eyebrow text-gold/90">{c.short}</div>
                <div className="font-display text-lg mt-1">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <section className="bg-ink text-bone mt-24">
        <div className="container-luxe grid lg:grid-cols-2 gap-16 py-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="eyebrow text-gold mb-4">OEM Manufacturing Process</div>
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
                  <span className="font-display text-gold text-2xl w-8">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="font-display text-lg">{t}</div>
                    <div className="text-sm text-bone/70 mt-0.5">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex gap-3">
              <Link to="/oem" className="btn-gold hover:brightness-95">Full OEM Process</Link>
              <button onClick={() => openInquiry()} className="btn-outline-bone hover:bg-bone hover:text-ink">Start OEM Project</button>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
            <img src={oemImg} alt="OEM sunglasses manufacturing" loading="lazy" width={1400} height={1000} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <Section eyebrow="Private Label & Customization" title="Every surface, brandable." right={<Link to="/customization" className="text-sm hover:text-gold flex items-center gap-2">All customization options <ArrowRight size={14} /></Link>}>
        <div className="grid lg:grid-cols-2 gap-10 mt-10">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={customImg} alt="Custom logo printing on sunglasses" loading="lazy" width={1400} height={1000} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            {["Temple Logo Printing","Lens Branding","Laser Engraving","Metal Logo Badge","Hard Case Printing","Soft Pouch Printing","Cleaning Cloth","Gift Box Printing","Barcode Stickers","Custom Packaging","Custom Colours","Custom Lens Tints"].map((o) => (
              <div key={o} className="border border-border p-4 flex items-center gap-3 hover:border-gold transition-colors">
                <Sparkles className="text-gold shrink-0" size={16} />
                <span className="text-sm">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {featured.length > 0 && (
        <Section eyebrow="Featured Products" title="Wholesale-ready silhouettes.">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {featured.map((p) => {
              const img = productPrimaryImage(p);
              return (
                <Link key={p.code} to="/product/$code" params={{ code: p.code }} className="group block">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    {img ? (
                      <img src={img} alt={p.name} loading="lazy" width={900} height={900} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">No image</div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="eyebrow">{p.code}</div>
                    <div className="font-display text-lg mt-1 group-hover:text-gold transition-colors">{p.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">₹{p.price} · MOQ {SITE.moq} pcs</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      <Section eyebrow="Industries We Serve" title="Trusted across the eyewear economy.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {["D2C Fashion Brands","Amazon & E-commerce","Optical Chains","Corporate Gifting","Promotional Agencies","Distributors & Importers","Exporters","Retail Chains"].map((i) => (
            <div key={i} className="border border-border p-6 text-center bg-card hover:bg-ink hover:text-bone hover:border-ink transition-colors">
              <Package size={20} className="mx-auto text-gold" />
              <div className="font-display mt-3">{i}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Buyers say" title="A partner our clients scale with.">
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            { q: "We launched our first private label collection in 6 weeks. Quality matched our reference frames from Milan.", a: "Founder, Northwind Eyewear (UK)" },
            { q: "Consistent quality across three repeat orders. Packaging and branding were exactly as approved.", a: "Category Head, Amazon Seller (US)" },
            { q: "Their sampling process is quick and their team is genuinely responsive. Ideal for corporate gifting programs.", a: "Procurement Lead, Fortune 500 (India)" },
          ].map((t) => (
            <figure key={t.a} className="border border-border p-8 bg-card">
              <div className="text-gold font-display text-3xl leading-none">"</div>
              <blockquote className="mt-4 text-sm leading-relaxed">{t.q}</blockquote>
              <figcaption className="eyebrow mt-6">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <section className="mt-24">
        <div className="container-luxe">
          <div className="relative overflow-hidden">
            <img src={collectionImg} alt="Sunglasses collection" loading="lazy" width={1600} height={1000} className="w-full h-72 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-ink/70 grid place-items-center text-center p-8">
              <div>
                <div className="eyebrow text-gold">Start your brand</div>
                <h3 className="font-display text-3xl md:text-4xl text-bone mt-3 max-w-2xl">Ready to launch your own sunglasses line?</h3>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <button onClick={openCatalogue} className="btn-gold hover:brightness-95"><Download size={14} /> Download Catalogue</button>
                  <button onClick={() => openInquiry()} className="btn-outline-bone hover:bg-bone hover:text-ink">Get OEM Quote</button>
                </div>
              </div>
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
