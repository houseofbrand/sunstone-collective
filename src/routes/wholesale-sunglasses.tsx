import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import collectionImg from "@/assets/collection-grid.jpg";

export const Route = createFileRoute("/wholesale-sunglasses")({
  component: WholesaleSunglassesPage,
  head: () => ({
    meta: [
      { title: "Wholesale Sunglasses Manufacturer & Supplier | B2B India" },
      {
        name: "description",
        content:
          "Wholesale sunglasses manufacturer and B2B supplier in India for retailers, distributors and importers. Low MOQ, custom branding and bulk supply.",
      },
      { property: "og:title", content: "Wholesale Sunglasses Manufacturer & Supplier" },
      {
        property: "og:description",
        content: "Wholesale eyewear supply for professional B2B buyers in India and worldwide.",
      },
      { property: "og:url", content: "/wholesale-sunglasses" },
    ],
    links: [{ rel: "canonical", href: "/wholesale-sunglasses" }],
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
              name: "Wholesale Sunglasses",
              item: "https://sunglassmanufacturer.com/wholesale-sunglasses",
            },
          ],
        }),
      },
    ],
  }),
});

function WholesaleSunglassesPage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wholesale Sunglasses" }]} />
      <header className="container-luxe grid items-center gap-12 pb-16 pt-8 lg:grid-cols-2">
        <div>
          <div className="eyebrow">B2B Sunglasses Supply</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Wholesale Sunglasses Manufacturer &amp; Supplier
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Source wholesale sunglasses for retail, distribution, e-commerce and import programmes.
            We support genuine business buyers with product selection, B2B pricing, custom logo
            options, private-label packaging, repeat orders and scalable bulk sunglasses supply.
          </p>
          <button
            onClick={() =>
              openCatalogRequest({ category: "Wholesale Sunglasses", source: "wholesale_seo" })
            }
            className="btn-gold mt-8"
          >
            Get Wholesale Catalogue &amp; Pricing <ArrowRight size={16} />
          </button>
        </div>
        <img
          src={collectionImg}
          alt="Wholesale sunglasses collection for retailers and distributors"
          width={1400}
          height={1000}
          className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-lifted"
        />
      </header>

      <section className="section-surface border-y border-border">
        <div className="container-luxe py-20">
          <h2 className="font-display text-3xl">
            Wholesale eyewear supply for professional buyers
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed">
            Quotations are prepared around style, material, lens, quantity, branding and packaging
            requirements. The low-MOQ programme starts from 12 pieces for applicable designs, while
            larger repeat and bulk orders can be planned around your market and sales channel.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Retailers and retail chains",
              "Distributors and importers",
              "E-commerce and D2C businesses",
              "Private-label eyewear brands",
              "Custom logo sunglasses",
              "Worldwide B2B order support",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-lg border border-border bg-card p-5 text-sm"
              >
                <CheckCircle2 size={18} className="shrink-0 text-primary" />
                {item}
              </div>
            ))}
          </div>
          <Link to="/collection" className="btn-outline-ink mt-8">
            View Sunglasses Collections
          </Link>
        </div>
      </section>
    </>
  );
}
