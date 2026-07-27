import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import oemImg from "@/assets/oem-process.jpg";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/oem-sunglasses-manufacturer")({
  component: OemManufacturerPage,
  head: () => ({
    meta: [
      { title: "OEM Sunglasses Manufacturer | Custom Eyewear Production" },
      {
        name: "description",
        content:
          "OEM sunglasses manufacturer for global brands. Product development, materials, custom colours, branding, sampling, packaging and scalable production.",
      },
      { property: "og:title", content: "OEM Sunglasses Manufacturer for Global Brands" },
      {
        property: "og:description",
        content:
          "Custom OEM eyewear development from product brief and sampling to bulk production.",
      },
      { property: "og:url", content: "/oem-sunglasses-manufacturer" },
    ],
    links: [{ rel: "canonical", href: "/oem-sunglasses-manufacturer" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://sunglassmanufacturer.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "OEM Sunglasses Manufacturer",
              item: "https://sunglassmanufacturer.com/oem-sunglasses-manufacturer",
            },
          ],
        }),
      },
    ],
  }),
});

const steps = [
  ["Product Brief", "Share references, target market, quantity and commercial requirements."],
  ["Design Selection", "Shortlist silhouettes or define the required frame development route."],
  ["Materials & Lenses", "Select suitable frame materials, lens options, components and finishes."],
  ["Colours & Branding", "Confirm colours, logo placement and the appropriate branding technique."],
  ["Sampling", "Review product, branding and packaging samples before approval."],
  ["Packaging", "Develop cases, pouches, cloths, boxes, inserts and retail presentation."],
  ["Quality Inspection", "Check finishing, alignment, functionality, branding and packing."],
  ["Production & Supply", "Plan bulk production and dispatch for the destination market."],
];

function OemManufacturerPage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "OEM Sunglasses Manufacturer" }]} />
      <header className="container-luxe grid items-center gap-12 pb-16 pt-8 lg:grid-cols-2">
        <div>
          <div className="eyebrow">Custom Eyewear Production</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            OEM Sunglasses Manufacturer for Global Brands
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Develop sunglasses around your product vision, market and brand identity. Our OEM
            eyewear process connects design selection, materials, colours, lenses, branding,
            sampling, packaging, quality inspection and scalable international B2B supply.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() =>
                openCatalogRequest({ category: "Custom OEM Sunglasses", source: "oem_seo" })
              }
              className="btn-gold"
            >
              Discuss Your OEM Project <ArrowRight size={16} />
            </button>
            <a
              href={waLink("Hello, I would like to discuss a custom OEM sunglasses project.")}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-ink"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
        <img
          src={oemImg}
          alt="OEM sunglasses manufacturing and product development"
          width={1400}
          height={1000}
          className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-lifted"
        />
      </header>

      <section className="section-surface border-y border-border">
        <div className="container-luxe py-20">
          <div className="eyebrow">OEM Development Process</div>
          <h2 className="mt-3 max-w-3xl font-display text-3xl">
            A practical route from product concept to production.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, text], index) => (
              <article key={title} className="card-luxe p-6">
                <div className="font-display text-3xl text-primary">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-display text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-4xl text-sm leading-relaxed">
            Low MOQ from 12 pieces applies to suitable ready private-label designs. Fully customised
            OEM developments may require a different MOQ depending on design, material, tooling and
            customisation requirements.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/category/aviator" className="btn-outline-ink">
              Aviator Product Examples
            </Link>
            <Link to="/category/polarized" className="btn-outline-ink">
              Polarized Product Examples
            </Link>
            <Link to="/private-label-sunglasses" className="btn-outline-ink">
              Compare Private Label
            </Link>
          </div>
          <div className="mt-12 border-t border-border pt-10">
            <h2 className="font-display text-2xl">OEM sunglasses FAQ</h2>
            <h3 className="mt-6 font-display text-lg">Does every OEM project start at 12 pcs?</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed">
              No. The 12-piece starting MOQ applies to selected ready private-label designs. Custom
              OEM quantities depend on materials, tooling, branding, packaging and development
              scope.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
