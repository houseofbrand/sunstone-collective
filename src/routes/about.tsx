import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, BriefcaseBusiness, CheckCircle2, Globe2, Package, Palette } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | SunglassManufacturer.com — OEM & Private Label Eyewear" },
      {
        name: "description",
        content:
          "Learn about SunglassManufacturer.com, an experienced B2B partner for OEM, private-label and custom-branded eyewear programmes.",
      },
      { property: "og:title", content: "About SunglassManufacturer.com" },
      {
        property: "og:description",
        content: "An experienced, brand-focused partner for scalable B2B eyewear programmes.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  const { openCatalogRequest } = useDialogs();

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />

      <header className="container-luxe max-w-5xl pb-16 pt-10 text-center">
        <div className="eyebrow">About SunglassManufacturer.com</div>
        <h1 className="mt-4 font-display">
          An Experienced Partner for OEM &amp; Private-Label Eyewear
        </h1>
        <div className="rule-gold mx-auto mt-6 w-16" />
        <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed">
          We work with brands, retailers, distributors, e-commerce businesses, corporate buyers and
          sourcing organisations to develop eyewear programmes around their product, quantity,
          branding, packaging and commercial requirements.
        </p>
      </header>

      <section className="section-surface border-y border-border py-20">
        <div className="container-luxe grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="eyebrow">Our Approach</div>
            <h2 className="mt-3 font-display">
              Build the right programme for the brand — then grow it responsibly.
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>
              With 25+ years of experience across watches, eyewear, fashion accessories and
              private-label business, our perspective extends beyond the product itself. We
              understand the importance of positioning, assortment planning, presentation,
              consistency and repeatability.
            </p>
            <p>
              The right sourcing route is different for every business. Some buyers need an existing
              design with their branding and packaging. Others need a more customised OEM
              development process. Our role is to help define that route clearly before production.
            </p>
            <p>
              We support Indian and international B2B enquiries, with an emphasis on professional
              communication, agreed specifications and long-term manufacturing relationships.
            </p>
          </div>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="max-w-3xl">
          <div className="eyebrow">Two Business Pathways</div>
          <h2 className="mt-3 font-display">Private label and custom OEM, clearly separated.</h2>
          <div className="rule-gold mt-5 w-16" />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="card-luxe p-8">
            <Palette className="text-primary" />
            <div className="eyebrow mt-5">Private Label</div>
            <h3 className="mt-3 font-display text-2xl">A faster route to a branded collection.</h3>
            <p className="mt-4 text-sm">
              Start from suitable existing designs, then define brand application and packaging.
            </p>
            <CapabilityList
              items={[
                "Product and colour selection",
                "Temple and lens branding where suitable",
                "Cases, pouches and cleaning cloths",
                "Retail boxes, inserts and labelling",
              ]}
            />
            <Link to="/customization" className="btn-outline-ink mt-7">
              Explore Private Label
            </Link>
          </article>
          <article className="card-luxe p-8">
            <BriefcaseBusiness className="text-primary" />
            <div className="eyebrow mt-5">Custom OEM / ODM</div>
            <h3 className="mt-3 font-display text-2xl">
              A development route shaped around your brief.
            </h3>
            <p className="mt-4 text-sm">
              Align references, materials, colours, components, branding and packaging before bulk
              production.
            </p>
            <CapabilityList
              items={[
                "Concept and reference review",
                "Material and colour development",
                "Sampling and approval",
                "Quality control and bulk production",
              ]}
            />
            <Link to="/oem" className="btn-outline-ink mt-7">
              View OEM Process
            </Link>
          </article>
        </div>
      </section>

      <section className="section-surface border-y border-border py-24">
        <div className="container-luxe">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">Why Work With Us</div>
            <h2 className="mt-3 font-display">A practical, B2B-first sourcing relationship.</h2>
            <div className="rule-gold mx-auto mt-5 w-16" />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BriefcaseBusiness,
                title: "Industry Experience",
                text: "25+ years across fashion accessories, brand development and private-label business.",
              },
              {
                icon: Boxes,
                title: "Flexible Production Planning",
                text: "Support for suitable first collections and larger repeat or volume programmes.",
              },
              {
                icon: Package,
                title: "Complete Brand Presentation",
                text: "Product branding, cases, pouches, cloths, boxes, inserts and labelling.",
              },
              {
                icon: Globe2,
                title: "India & International Focus",
                text: "A professional enquiry and development approach for domestic and global B2B buyers.",
              },
            ].map((item) => (
              <article key={item.title} className="card-luxe p-7">
                <item.icon className="text-primary" size={23} />
                <h3 className="mt-5 font-display text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="eyebrow">Quality Approach</div>
            <h2 className="mt-3 font-display">Quality at every stage.</h2>
            <p className="mt-5">
              Quality is managed through development, production checks and final inspection,
              focusing on product consistency, finishing, functionality, branding and packaging.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Frame and lens inspection",
              "Hinge and temple alignment",
              "Surface and finish review",
              "Logo placement inspection",
              "Colour consistency",
              "Packaging inspection",
              "Random production checks",
              "Final pre-dispatch review",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-2 rounded-lg border border-border bg-card p-4 text-sm"
              >
                <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={17} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe pb-24">
        <div className="rounded-2xl bg-[#081A32] px-8 py-14 text-center md:px-16">
          <div className="eyebrow">Let&apos;s Build Your Eyewear Programme</div>
          <h2 className="mx-auto mt-3 max-w-3xl font-display">
            Share your product, quantity, branding and packaging requirements.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl">
            {SITE.moqDetailed}. Build a flexible collection across selected models and colours, then
            scale future requirements as your business grows.
          </p>
          <button
            onClick={() =>
              openCatalogRequest({ category: "Sunglasses", source: "about_final_cta" })
            }
            className="btn-gold mt-8"
          >
            Submit OEM Enquiry
          </button>
        </div>
      </section>
    </>
  );
}

function CapabilityList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-white/75">
          <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={16} />
          {item}
        </li>
      ))}
    </ul>
  );
}
