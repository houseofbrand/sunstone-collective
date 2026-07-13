import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Building2, ShoppingBag, Gift, Megaphone, Store, Globe, Briefcase, Rocket } from "lucide-react";

export const Route = createFileRoute("/industries")({
  component: IndustriesPage,
  head: () => ({
    meta: [
      { title: "Industries We Serve | OEM Sunglasses for Brands, Retailers & Exporters" },
      { name: "description", content: "D2C brands, Amazon sellers, optical chains, corporate gifting, promotional agencies, distributors, importers, exporters. Trusted OEM sunglasses across industries." },
      { property: "og:title", content: "Industries We Serve — OEMSunglasses.com" },
      { property: "og:description", content: "OEM sunglasses across D2C, retail, corporate, promotional and export." },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
});

const rows = [
  { icon: Rocket, t: "D2C Fashion Brands", d: "Launch a private label collection with editorial silhouettes, custom lens tints and branded packaging." },
  { icon: ShoppingBag, t: "Amazon & E-commerce Sellers", d: "Amazon-ready barcodes, poly bags, master cartons and repeat replenishment on your listings." },
  { icon: Store, t: "Optical Chains", d: "Bulk manufacturing for private-label optical programs — polarized, driving, prescription-ready fronts." },
  { icon: Gift, t: "Corporate Gifting", d: "Branded temples, printed cases and custom gift boxes for enterprise gifting programs." },
  { icon: Megaphone, t: "Promotional Agencies", d: "Ultra-low-cost custom sunglasses for events, campaigns and giveaways from 100 pieces." },
  { icon: Briefcase, t: "Distributors & Importers", d: "Deep product range, consistent stock, tiered pricing and container-load export solutions." },
  { icon: Globe, t: "Exporters", d: "Full export documentation, HS codes, freight partners and country-specific compliance." },
  { icon: Building2, t: "Retail Chains", d: "Store-ready packaging with per-SKU barcoding and end-cap display kits available." },
];

function IndustriesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Industries" }]} />
      <header className="container-luxe pt-8 pb-14">
        <div className="eyebrow">Industries We Serve</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3 max-w-3xl">Trusted across the eyewear economy.</h1>
        <div className="rule-gold mt-6 w-16" />
      </header>
      <section className="container-luxe pb-24 grid md:grid-cols-2 gap-6">
        {rows.map((r) => (
          <div key={r.t} className="border border-border p-8 bg-card hover:border-gold transition-colors flex gap-5">
            <r.icon className="text-gold shrink-0" size={26} />
            <div>
              <div className="font-display text-xl">{r.t}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.d}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
