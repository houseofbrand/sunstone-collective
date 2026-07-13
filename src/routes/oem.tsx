import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import oemImg from "@/assets/oem-process.jpg";

export const Route = createFileRoute("/oem")({
  component: OemPage,
  head: () => ({
    meta: [
      { title: "OEM Sunglasses Manufacturing Process | OEMSunglasses.com" },
      { name: "description", content: "Our OEM sunglasses manufacturing process — from consultation and sampling to production, QC and worldwide dispatch. Low MOQ, custom logo, private label ready." },
      { property: "og:title", content: "OEM Sunglasses Manufacturing Process" },
      { property: "og:description", content: "Sketch to shipment in six deliberate steps — India's trusted OEM sunglasses partner." },
      { property: "og:url", content: "/oem" },
    ],
    links: [{ rel: "canonical", href: "/oem" }],
  }),
});

const steps = [
  ["Consultation", "Share your brand, quantities, budget and reference styles. We align on materials, target retail price and timelines."],
  ["Sampling", "3D prototype + physical sample delivered within 7–12 days for approval, revisions and colour matching."],
  ["Approval", "You approve colours, materials, branding, packaging and freight — everything locked before mass production begins."],
  ["Production", "Mass manufacturing across metal, acetate, TR90 and titanium lines. Live production updates and photos shared weekly."],
  ["QC & Packaging", "Every piece is inspected, UV-tested, cleaned and packed to your specification. Random samples cross-audited."],
  ["Dispatch", "Worldwide door-to-door via sea, air or courier. Full export documentation, HS codes and invoices prepared."],
];

function OemPage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "OEM Process" }]} />
      <header className="container-luxe pt-8 pb-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="eyebrow">OEM Manufacturing</div>
          <h1 className="font-display text-4xl md:text-5xl mt-3">From sketch to shipment.<br/><span className="text-primary italic font-normal">Six deliberate steps.</span></h1>
          <p className="mt-5 text-muted-foreground max-w-xl">Our OEM programme is built for founders, D2C brands, exporters and corporate buyers who want a manufacturing partner — not just a supplier.</p>
          <div className="rule-gold mt-6 w-16" />
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => openCatalogRequest({ category: "Sunglasses", source: "oem_page" })} className="btn-gold rounded-lg">Request OEM Catalog</button>
          </div>
        </div>
        <div className="aspect-[4/5] overflow-hidden">
          <img src={oemImg} alt="OEM sunglasses manufacturing" loading="lazy" width={1400} height={1000} className="w-full h-full object-cover" />
        </div>
      </header>

      <section className="section-surface border-y border-border">
        <div className="container-luxe py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {steps.map(([t, d], i) => (
            <div key={t}>
              <div className="font-display text-primary text-4xl">{String(i + 1).padStart(2, "0")}</div>
              <div className="font-display text-xl mt-3">{t}</div>
              <p className="text-sm text-secondary-foreground mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe py-20 grid md:grid-cols-3 gap-6">
        {[
          { t: "Materials", v: "Italian acetate · Japanese titanium · TR90 · Stainless steel · Alloy metals" },
          { t: "Lenses", v: "TAC polarized · CR-39 · Nylon · Polycarbonate · Mirror · Gradient · Photochromic" },
          { t: "MOQ", v: "12 pieces for stock · 100–300 for fully custom OEM tooling" },
          { t: "Sampling", v: "7–12 days · 3D render + physical sample · nominal cost adjustable against bulk order" },
          { t: "Production", v: "15–30 days depending on quantity, materials and branding scope" },
          { t: "Export", v: "40+ countries · full documentation · sea, air & courier partners" },
        ].map((b) => (
          <div key={b.t} className="border border-border p-6">
            <div className="eyebrow">{b.t}</div>
            <div className="mt-2 text-sm leading-relaxed">{b.v}</div>
          </div>
        ))}
      </section>
    </>
  );
}
