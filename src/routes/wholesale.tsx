import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/wholesale")({
  component: WholesalePage,
  head: () => ({
    meta: [
      { title: "B2B Sunglasses Supply | Private Label & OEM | SunglassManufacturer.com" },
      {
        name: "description",
        content: `B2B sunglasses sourcing for retailers, importers and distributors. ${SITE.moqDetailed}, with private-label and OEM options.`,
      },
      { property: "og:title", content: "Professional B2B Sunglasses Sourcing" },
      {
        property: "og:description",
        content: "Private-label, OEM and repeat-order sourcing for professional B2B buyers.",
      },
      { property: "og:url", content: "/wholesale" },
    ],
    links: [{ rel: "canonical", href: "/wholesale-sunglasses" }],
  }),
});

function WholesalePage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wholesale" }]} />
      <header className="container-luxe pt-8 pb-16">
        <div className="eyebrow">Wholesale Program</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3 max-w-3xl">
          Professional eyewear sourcing, built for B2B buyers.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          {SITE.moqDetailed}. Quotations are prepared around product type, quantity, branding,
          packaging and customisation requirements.
        </p>
        <div className="rule-gold mt-6 w-16" />
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => openCatalogRequest({ category: "Sunglasses", source: "wholesale_page" })}
            className="btn-gold rounded-lg hover:brightness-95"
          >
            Request Wholesale Pricing
          </button>
        </div>
      </header>

      <section className="container-luxe pb-24 grid md:grid-cols-2 gap-6">
        {[
          {
            t: "B2B Pricing",
            d: "Pricing is quoted after reviewing product, quantity, material, branding, packaging and customisation requirements.",
          },
          {
            t: "Commercial MOQ",
            d: SITE.moqDetailed,
          },
          {
            t: "Private Label vs OEM",
            d: "Select existing designs for a faster private-label route, or discuss a customised OEM development programme.",
          },
          {
            t: "Commercial Planning",
            d: "Payment, production and dispatch terms are confirmed against the approved quotation and programme scope.",
          },
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
