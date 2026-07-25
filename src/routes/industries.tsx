import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  Building2,
  ShoppingBag,
  Gift,
  Megaphone,
  Store,
  Globe,
  Briefcase,
  Rocket,
} from "lucide-react";

export const Route = createFileRoute("/industries")({
  component: IndustriesPage,
  head: () => ({
    meta: [
      { title: "Industries We Serve | OEM Sunglasses for Brands, Retailers & Exporters" },
      {
        name: "description",
        content:
          "OEM and private-label eyewear programmes for D2C brands, retail chains, corporate buyers, distributors, importers and sourcing teams.",
      },
      { property: "og:title", content: "Businesses We Serve — SunglassManufacturer.com" },
      {
        property: "og:description",
        content: "OEM sunglasses across D2C, retail, corporate, promotional and export.",
      },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
});

const rows = [
  {
    icon: Rocket,
    t: "D2C Fashion Brands",
    d: "Private-label and custom OEM programmes planned around assortment, positioning and brand presentation.",
  },
  {
    icon: ShoppingBag,
    t: "Amazon & E-commerce Sellers",
    d: "Product, packaging and labelling requirements aligned for online retail and repeat ordering.",
  },
  {
    icon: Store,
    t: "Optical Chains",
    d: "Private-label eyewear programmes built around the chain's category and product requirements.",
  },
  {
    icon: Gift,
    t: "Corporate Gifting",
    d: "Product branding and packaging options for corporate gifting programmes.",
  },
  {
    icon: Megaphone,
    t: "Promotional Agencies",
    d: "Branded eyewear programmes for events, campaigns and promotional merchandise requirements.",
  },
  {
    icon: Briefcase,
    t: "Distributors & Importers",
    d: "Product assortments and B2B programmes planned around channel, quantity and market requirements.",
  },
  {
    icon: Globe,
    t: "International Sourcing Teams",
    d: "Product, branding and packaging briefs aligned for international B2B requirements.",
  },
  {
    icon: Building2,
    t: "Retail Chains",
    d: "Product assortments, private-label branding and packaging planned for retail requirements.",
  },
];

function IndustriesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Industries" }]} />
      <header className="container-luxe pt-8 pb-14">
        <div className="eyebrow">Industries We Serve</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3 max-w-3xl">
          Built for professional eyewear buyers.
        </h1>
        <div className="rule-gold mt-6 w-16" />
      </header>
      <section className="container-luxe pb-24 grid md:grid-cols-2 gap-6">
        {rows.map((r) => (
          <div
            key={r.t}
            className="border border-border p-8 bg-card hover:border-gold transition-colors flex gap-5"
          >
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
