import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About OEMSunglasses.com | India's OEM Sunglasses Manufacturing Partner" },
      { name: "description", content: "OEMSunglasses.com is India's trusted OEM sunglasses manufacturer — serving D2C brands, retailers, importers and exporters worldwide with low MOQ and custom private label." },
      { property: "og:title", content: "About OEMSunglasses.com" },
      { property: "og:description", content: "India's OEM sunglasses manufacturing partner." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
      <header className="container-luxe pt-8 pb-14 max-w-3xl">
        <div className="eyebrow">Our Story</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3">A manufacturing partner, not a supplier.</h1>
        <div className="rule-gold mt-6 w-16" />
        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>OEMSunglasses.com is a specialist OEM sunglasses manufacturer based in India, serving brands, distributors, importers and exporters across 40+ countries. We are exclusively B2B — no retail, no consumer noise.</p>
          <p>Our facility runs metal, acetate, TR90 and titanium production lines, with in-house branding capabilities including laser engraving, pad printing, doming, screen printing and full packaging development. From 12 pieces to 100,000 — the pricing structure and quality standard remain the same.</p>
          <p>We work with founders launching their first private label collection, established D2C brands scaling into new SKUs, corporate procurement teams building gifting programs, and exporters supplying regional markets. Every project moves through the same six deliberate steps: consultation, sampling, approval, production, QC and dispatch.</p>
        </div>
      </header>

      <section className="container-luxe pb-24 grid md:grid-cols-4 gap-6">
        {[["40+","Countries"],["1M+","Pieces / year"],["500+","Brands served"],["12","Piece MOQ"]].map(([v,k]) => (
          <div key={k} className="border border-border p-8 text-center">
            <div className="font-display text-4xl text-gold">{v}</div>
            <div className="eyebrow mt-2">{k}</div>
          </div>
        ))}
      </section>
    </>
  );
}
