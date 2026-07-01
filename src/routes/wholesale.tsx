import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/wholesale")({
  component: WholesalePage,
  head: () => ({
    meta: [
      { title: "Wholesale Sunglasses India | Bulk Supplier | OEMSunglasses.com" },
      { name: "description", content: `Wholesale sunglasses supplier in India. Order in multiples of ${SITE.moq}. Aviator, polarized, sports, fashion, luxury frames for retailers, importers and exporters.` },
      { property: "og:title", content: "Wholesale Sunglasses India — Bulk Supplier" },
      { property: "og:description", content: "Wholesale ordering, quotation and repeat orders. No retail checkout." },
      { property: "og:url", content: "/wholesale" },
    ],
    links: [{ rel: "canonical", href: "/wholesale" }],
  }),
});

function WholesalePage() {
  const { openInquiry, openCatalogue } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wholesale" }]} />
      <header className="container-luxe pt-8 pb-16">
        <div className="eyebrow">Wholesale Program</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3 max-w-3xl">Bulk sunglasses ordering, built for buyers.</h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">Order in multiples of {SITE.moq}. Request quotation. Add multiple products. Submit wholesale order — no retail checkout, no consumer noise.</p>
        <div className="rule-gold mt-6 w-16" />
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => openInquiry()} className="btn-gold hover:brightness-95">Request Quotation</button>
          <button onClick={() => openCatalogue()} className="btn-outline-ink hover:bg-ink hover:text-bone">Download Wholesale Catalogue</button>
        </div>
      </header>

      <section className="container-luxe pb-24 grid md:grid-cols-2 gap-6">
        {[
          { t: "Wholesale Pricing", d: "Slab pricing published on request. Tiered breaks at 12, 60, 300, 1000, 5000 pieces per style." },
          { t: "Payment Terms", d: "50% advance for OEM, balance on dispatch. Repeat orders on flexible LC/TT terms." },
          { t: "Stock vs OEM", d: "Ready stock ships in 3–7 days. Custom OEM production runs 15–30 days depending on scope." },
          { t: "Export Documentation", d: "GST invoice, packing list, commercial invoice, HS code and country-specific compliance." },
        ].map((b) => (
          <div key={b.t} className="border border-border p-8 bg-card">
            <div className="eyebrow text-gold">{b.t}</div>
            <p className="mt-3 text-sm leading-relaxed">{b.d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
