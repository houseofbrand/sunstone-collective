import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import customImg from "@/assets/brand-every-detail.png";
import collectionImg from "@/assets/collection-grid.jpg";

export const Route = createFileRoute("/private-label-sunglasses")({
  component: PrivateLabelPage,
  head: () => ({
    meta: [
      { title: "Private Label Sunglasses Manufacturer | Low MOQ Custom Eyewear" },
      {
        name: "description",
        content:
          "Build a branded sunglasses collection with custom logos, cases and retail packaging. Low MOQ from 12 pcs and worldwide B2B supply.",
      },
      { property: "og:title", content: "Private Label Sunglasses Manufacturer" },
      {
        property: "og:description",
        content: "Low-MOQ private label eyewear with custom branding and retail-ready packaging.",
      },
      { property: "og:url", content: "/private-label-sunglasses" },
    ],
    links: [{ rel: "canonical", href: "/private-label-sunglasses" }],
    scripts: [breadcrumbSchema("Private Label Sunglasses", "/private-label-sunglasses")],
  }),
});

function breadcrumbSchema(name: string, path: string) {
  return {
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
          name,
          item: `https://sunglassmanufacturer.com${path}`,
        },
      ],
    }),
  };
}

const capabilities = [
  "Logo customisation",
  "Temple branding",
  "Lens branding where suitable",
  "Custom colours and finishes",
  "Branded cases and pouches",
  "Custom cleaning cloths",
  "Retail-ready boxes and inserts",
  "Low-MOQ and bulk production",
];

function PrivateLabelPage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Private Label Sunglasses" }]} />
      <header className="container-luxe grid items-center gap-12 pb-16 pt-8 lg:grid-cols-2">
        <div>
          <div className="eyebrow">Private Label Eyewear · Low MOQ</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Private Label Sunglasses Manufacturer
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Build your own sunglasses collection with private-label eyewear solutions designed for
            fashion brands, retailers, distributors, influencers and e-commerce businesses. Choose
            suitable designs, add your brand identity and develop retail-ready packaging with a low
            starting MOQ from 12 pieces.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() =>
                openCatalogRequest({
                  category: "Private Label Sunglasses",
                  source: "private_label_seo",
                })
              }
              className="btn-gold"
            >
              Get Private Label Catalogue <ArrowRight size={16} />
            </button>
            <Link to="/collection" className="btn-outline-ink">
              Explore Designs
            </Link>
          </div>
        </div>
        <img
          src={customImg}
          alt="Private label sunglasses logo customisation and branded packaging"
          width={1402}
          height={1122}
          className="w-full rounded-2xl border border-border object-cover shadow-lifted"
        />
      </header>

      <section className="section-surface border-y border-border">
        <div className="container-luxe grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <img
            src={collectionImg}
            alt="Private label sunglasses collection for fashion brands"
            loading="lazy"
            className="min-h-80 w-full rounded-2xl object-cover"
          />
          <div>
            <div className="eyebrow">Your Product. Your Brand.</div>
            <h2 className="mt-3 font-display text-3xl">
              Launch faster with suitable ready designs.
            </h2>
            <p className="mt-4 text-sm leading-relaxed">
              Private label is the practical route when you want to select from available eyewear
              styles and apply your own identity. It reduces development complexity while still
              creating a cohesive branded product and packaging presentation.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div
                  key={item}
                  className="flex gap-2 rounded-lg border border-border bg-card p-4 text-sm"
                >
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe py-20">
        <h2 className="font-display text-3xl">From 12 pieces to scalable worldwide B2B supply</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed">
          Our low MOQ programme starts from 12 pieces for applicable designs, helping buyers test a
          collection before expanding successful models. Larger private-label and repeat-order
          programmes can be planned around your product mix, branding, packaging and destination.
        </p>
      </section>
    </>
  );
}
