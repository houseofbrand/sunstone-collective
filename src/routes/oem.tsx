import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import oemImg from "@/assets/oem-process.jpg";

export const Route = createFileRoute("/oem")({
  component: OemPage,
  head: () => ({
    meta: [
      { title: "Custom OEM Sunglasses Development | SunglassManufacturer.com" },
      {
        name: "description",
        content:
          "A structured custom OEM eyewear process covering product references, materials, colours, branding, sampling, packaging, quality control and bulk production.",
      },
      { property: "og:title", content: "OEM Sunglasses Manufacturing Process" },
      {
        property: "og:description",
        content: "A structured custom OEM eyewear process from product brief to bulk production.",
      },
      { property: "og:url", content: "/oem" },
    ],
    links: [{ rel: "canonical", href: "/oem" }],
  }),
});

const steps = [
  [
    "Concept / Reference",
    "Share your brand direction, product references, quantities and commercial requirements.",
  ],
  [
    "Design Selection",
    "Define the product route, shortlisted silhouettes and the required level of custom development.",
  ],
  [
    "Material & Colour",
    "Align frame, lens, finish, colour and component requirements for the selected product.",
  ],
  ["Branding", "Confirm logo placement, artwork, application method and packaging identity."],
  [
    "Sampling",
    "Review the product, branding and packaging sample before approving bulk production.",
  ],
  [
    "Quality Control",
    "Inspect the approved product requirements, finishing, functionality, branding and packaging.",
  ],
  [
    "Bulk Production",
    "Plan production against the approved sample, quantity and commercial terms.",
  ],
  ["Dispatch", "Confirm packing and dispatch requirements for the destination market."],
];

function OemPage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "OEM Process" }]} />
      <header className="container-luxe pt-8 pb-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="eyebrow">OEM Manufacturing</div>
          <h1 className="font-display text-4xl md:text-5xl mt-3">
            Develop eyewear around your brand vision.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl">
            Our custom OEM programme is built for brands and sourcing teams that need more than an
            existing product with a logo. The development path is defined around the product,
            material, colour, branding, packaging and volume brief.
          </p>
          <div className="rule-gold mt-6 w-16" />
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => openCatalogRequest({ category: "Sunglasses", source: "oem_page" })}
              className="btn-gold rounded-lg"
            >
              Discuss Your OEM Project
            </button>
          </div>
        </div>
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={oemImg}
            alt="Eyewear product development and finishing detail"
            loading="lazy"
            width={1400}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <section className="section-surface border-y border-border">
        <div className="container-luxe py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {steps.map(([t, d], i) => (
            <div key={t}>
              <div className="font-display text-primary text-4xl">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-display text-xl mt-3">{t}</div>
              <p className="text-sm text-secondary-foreground mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe py-20 grid md:grid-cols-3 gap-6">
        {[
          {
            t: "Starting MOQ",
            v: "From 120 pieces for suitable products and private-label programmes. Custom OEM quantities depend on the development scope.",
          },
          {
            t: "Product Brief",
            v: "References, market positioning, materials, colours, lenses, components and target quantity.",
          },
          {
            t: "Branding",
            v: "Temple, lens and metal-detail options selected according to product suitability.",
          },
          {
            t: "Packaging",
            v: "Cases, pouches, cleaning cloths, retail boxes, inserts and labelling.",
          },
          {
            t: "Approval",
            v: "Bulk production follows the agreed product, branding and packaging sample.",
          },
          {
            t: "Quality",
            v: "Inspection focuses on consistency, finishing, functionality, branding and packaging.",
          },
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
