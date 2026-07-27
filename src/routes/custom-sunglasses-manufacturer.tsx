import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import customImg from "@/assets/brand-every-detail.png";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/custom-sunglasses-manufacturer")({
  component: CustomSunglassesPage,
  head: () => ({
    meta: [
      { title: "Custom Sunglasses Manufacturer | Logo & Branded Eyewear" },
      {
        name: "description",
        content:
          "Custom sunglasses with your logo, colours and branded packaging. Private-label and OEM eyewear solutions for global brands and B2B buyers.",
      },
      { property: "og:title", content: "Custom Sunglasses Manufacturer" },
      {
        property: "og:description",
        content:
          "Create branded sunglasses with custom logos, finishes, accessories and packaging.",
      },
      { property: "og:url", content: "/custom-sunglasses-manufacturer" },
    ],
    links: [{ rel: "canonical", href: "/custom-sunglasses-manufacturer" }],
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
              name: "Custom Sunglasses Manufacturer",
              item: "https://sunglassmanufacturer.com/custom-sunglasses-manufacturer",
            },
          ],
        }),
      },
    ],
  }),
});

const options = [
  ["Frame", "Custom colours, finishes and suitable material options"],
  ["Temple", "Printed, engraved or applied custom logo sunglasses"],
  ["Lens", "Lens branding and tints where technically suitable"],
  ["Details", "Metal badges and decorative brand components"],
  ["Case", "Protective cases with your brand identity"],
  ["Pouch & Cloth", "Private-label pouches and custom cleaning cloths"],
  ["Retail Box", "Branded boxes, inserts and retail-ready presentation"],
  ["Scale", "Low-MOQ private label and scalable OEM sunglasses supply"],
];

function CustomSunglassesPage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Custom Sunglasses" }]} />
      <header className="container-luxe grid items-center gap-12 pb-16 pt-8 lg:grid-cols-2">
        <div>
          <div className="eyebrow">Custom Logo Sunglasses · Branded Eyewear</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Custom Sunglasses Manufacturer</h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Create custom eyewear that carries your identity from the frame to the retail box. We
            support fashion brands, retailers and e-commerce businesses with custom sunglasses with
            logos, branded accessories, private-label packaging and OEM sunglasses development.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() =>
                openCatalogRequest({ category: "Custom Sunglasses", source: "custom_seo" })
              }
              className="btn-gold"
            >
              Get OEM Quote <ArrowRight size={16} />
            </button>
            <a
              href={waLink("Hello, I would like custom logo sunglasses and packaging options.")}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-ink"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
        <img
          src={customImg}
          alt="Custom sunglasses with logo and branded eyewear packaging"
          width={1402}
          height={1122}
          className="w-full rounded-2xl border border-border object-cover shadow-lifted"
        />
      </header>

      <section className="section-surface border-y border-border">
        <div className="container-luxe py-20">
          <div className="eyebrow">Your Brand. Every Detail.</div>
          <h2 className="mt-3 font-display text-3xl">
            Build a complete custom eyewear collection.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {options.map(([title, text]) => (
              <article key={title} className="card-luxe p-6">
                <Sparkles size={18} className="text-primary" />
                <h3 className="mt-4 font-display text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/private-label-sunglasses" className="btn-outline-ink">
              Explore Private Label
            </Link>
            <Link to="/oem-sunglasses-manufacturer" className="btn-outline-ink">
              Explore Custom OEM
            </Link>
            <Link to="/category/women" className="btn-outline-ink">
              Women&apos;s Product Examples
            </Link>
            <Link to="/category/men" className="btn-outline-ink">
              Men&apos;s Product Examples
            </Link>
          </div>
          <div className="mt-12 border-t border-border pt-10">
            <h2 className="font-display text-2xl">Custom sunglasses FAQ</h2>
            <h3 className="mt-6 font-display text-lg">Where can my logo be applied?</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed">
              Depending on product suitability, branding can be applied to temples, lenses, metal
              details, cases, pouches, cleaning cloths and retail packaging.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
