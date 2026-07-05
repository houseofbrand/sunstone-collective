import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | SunglassManufacturer.com — OEM & Private Label Sunglasses" },
      { name: "description", content: "SunglassManufacturer.com is your trusted B2B partner for OEM sunglasses manufacturing, private label sunglasses, wholesale eyewear, and custom branding. Serving brands, retailers, importers and distributors worldwide." },
      { property: "og:title", content: "About SunglassManufacturer.com" },
      { property: "og:description", content: "Trusted OEM, private label and wholesale sunglasses manufacturing partner for global brands." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />

      <header className="container-luxe pt-10 pb-16 max-w-4xl text-center">
        <div className="eyebrow">About Us</div>
        <h1 className="font-display mt-4">
          Your Trusted OEM, Private Label & Wholesale Sunglasses Manufacturing Partner
        </h1>
        <div className="rule-gold mt-6 mx-auto w-16" />
        <p className="mt-8 text-lg leading-relaxed">
          SunglassManufacturer.com is a leading B2B platform specializing in OEM sunglasses manufacturing,
          private label sunglasses, wholesale sunglasses, and custom eyewear production for brands across the globe.
        </p>
      </header>

      <section className="container-luxe pb-20 max-w-4xl">
        <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
          <p>
            We help entrepreneurs, fashion brands, retailers, distributors, importers, e-commerce businesses, and
            corporate organizations develop and source premium-quality sunglasses directly from experienced
            manufacturing partners.
          </p>
          <p>
            Whether you are launching your first eyewear collection or expanding an established brand, we provide
            complete end-to-end manufacturing solutions—from product development and prototyping to branding,
            packaging, quality control, and global delivery.
          </p>
        </div>
      </section>

      <section className="section-surface py-20">
        <div className="container-luxe max-w-4xl">
          <div className="eyebrow">Our Story</div>
          <h2 className="font-display mt-3">A partner built for modern eyewear brands.</h2>
          <div className="rule-gold mt-6 w-16" />
          <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
            <p>
              At SunglassManufacturer.com, we believe every successful eyewear brand deserves a reliable
              manufacturing partner.
            </p>
            <p>
              With decades of experience in fashion accessories and international sourcing, we understand what modern
              brands expect—consistent quality, competitive pricing, dependable production timelines, and the
              flexibility to customize products according to their identity.
            </p>
            <p>
              Our manufacturing ecosystem combines design expertise, advanced production capabilities, quality
              assurance, and efficient logistics to help businesses build successful eyewear collections.
            </p>
            <p>
              Today, we proudly serve customers across India and international markets with scalable manufacturing
              solutions for businesses of every size.
            </p>
          </div>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="eyebrow text-center">What We Do</div>
        <h2 className="font-display text-center mt-3">Specialized manufacturing for every eyewear category.</h2>
        <div className="rule-gold mt-6 mx-auto w-16" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Fashion Sunglasses",
            "Premium Sunglasses",
            "Polarized Sunglasses",
            "UV400 Sunglasses",
            "Metal Frame Sunglasses",
            "TR90 Sunglasses",
            "Acetate Sunglasses",
            "Sports Sunglasses",
            "Aviator Sunglasses",
            "Wayfarer Sunglasses",
            "Square Sunglasses",
            "Round Sunglasses",
            "Oversized Sunglasses",
            "Cat Eye Sunglasses",
            "Rimless Sunglasses",
            "Kids Sunglasses",
            "Men's Sunglasses",
            "Women's Sunglasses",
          ].map((item) => (
            <div key={item} className="card-luxe p-5 flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-muted-foreground">Every collection can be customized according to your brand requirements.</p>
      </section>

      <section className="section-surface py-24">
        <div className="container-luxe max-w-4xl">
          <div className="grid md:grid-cols-3 gap-10">
            <ServiceCard
              eyebrow="OEM Sunglasses Manufacturer"
              title="Products that carry your brand identity."
              intro="As an experienced OEM Sunglasses Manufacturer, we manufacture products that carry your brand identity."
              items={[
                "Custom Product Development",
                "Frame Design",
                "Lens Selection",
                "Color Customization",
                "Logo Printing",
                "Temple Branding",
                "Laser Engraving",
                "Custom Packaging",
                "Barcode & SKU Labelling",
                "Retail Ready Packaging",
              ]}
            />
            <ServiceCard
              eyebrow="Private Label Sunglasses"
              title="Launch your own eyewear brand."
              intro="Launching your own sunglasses brand has never been easier."
              items={[
                "Custom Brand Name",
                "Logo Application",
                "Premium Packaging",
                "Gift Boxes",
                "Instruction Manuals",
                "Warranty Cards",
                "Cleaning Cloth Branding",
                "Carrying Pouch Branding",
              ]}
            />
            <ServiceCard
              eyebrow="Wholesale Sunglasses Supplier"
              title="Bulk supply for every sales channel."
              intro="We supply sunglasses in bulk to:"
              items={[
                "Retail Chains",
                "Online Sellers",
                "Fashion Stores",
                "Optical Stores",
                "Lifestyle Brands",
                "Corporate Buyers",
                "Promotional Companies",
                "Distributors",
                "Importers",
                "Exporters",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="eyebrow">Manufacturing Capabilities</div>
            <h2 className="font-display mt-3">End-to-end production under one roof.</h2>
            <div className="rule-gold mt-6 w-16" />
            <ul className="mt-8 grid gap-3">
              {[
                "Product Design",
                "CAD Development",
                "Prototype Sampling",
                "Mold Development",
                "Injection Moulding",
                "Metal Frame Production",
                "Lens Assembly",
                "UV Protection Testing",
                "Polarized Lens Manufacturing",
                "Quality Inspection",
                "Packaging",
                "Export Documentation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-muted-foreground">Every production stage follows strict quality standards to ensure consistency.</p>
          </div>

          <div>
            <div className="eyebrow">Custom Branding Services</div>
            <h2 className="font-display mt-3">Your brand deserves to stand out.</h2>
            <div className="rule-gold mt-6 w-16" />
            <ul className="mt-8 grid gap-3">
              {[
                "Logo Printing",
                "Metal Logo Application",
                "Laser Engraving",
                "Custom Lens Branding",
                "Customized Temple Design",
                "Exclusive Colour Combinations",
                "Premium Packaging",
                "Retail Packaging",
                "Corporate Gift Packaging",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-surface py-24">
        <div className="container-luxe">
          <div className="max-w-3xl mx-auto text-center">
            <div className="eyebrow">Industries We Serve</div>
            <h2 className="font-display mt-3">Manufacturing expertise across markets.</h2>
            <div className="rule-gold mt-6 mx-auto w-16" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Fashion Industry",
              "Lifestyle Brands",
              "Optical Retail",
              "E-commerce",
              "Corporate Gifting",
              "Promotional Merchandise",
              "Sports Brands",
              "Travel Accessories",
              "Luxury Accessories",
              "Uniform & Safety Programs",
            ].map((item) => (
              <div key={item} className="card-luxe p-5 flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow">Why Choose SunglassManufacturer.com?</div>
          <h2 className="font-display mt-3">The partner your eyewear brand has been looking for.</h2>
          <div className="rule-gold mt-6 mx-auto w-16" />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Experienced Manufacturing Partner", text: "Our team understands international quality expectations and modern eyewear trends." },
            { title: "Factory Direct Pricing", text: "Competitive manufacturing costs without compromising quality." },
            { title: "OEM & Private Label Expertise", text: "We specialize in helping brands build their own eyewear collections." },
            { title: "Quality Assurance", text: "Every production batch undergoes multiple quality inspections before shipment." },
            { title: "Flexible MOQs", text: "Suitable for both growing brands and large-scale buyers." },
            { title: "Fast Sampling", text: "Rapid product development helps reduce your time to market." },
            { title: "Worldwide Shipping", text: "We support exports with professional documentation and logistics coordination." },
          ].map(({ title, text }) => (
            <div key={title} className="card-luxe p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-surface py-24">
        <div className="container-luxe max-w-4xl">
          <div className="eyebrow">Quality Standards</div>
          <h2 className="font-display mt-3">Quality is the foundation of our business.</h2>
          <div className="rule-gold mt-6 w-16" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Frame Finish Inspection",
              "Lens Quality Inspection",
              "UV Protection Verification",
              "Hinge Testing",
              "Logo Inspection",
              "Packaging Inspection",
              "Carton Inspection",
              "Random Batch Quality Audits",
            ].map((item) => (
              <div key={item} className="card-luxe p-5 flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-muted-foreground">This ensures that every shipment meets customer expectations.</p>
        </div>
      </section>

      <section className="container-luxe py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="card-luxe p-8">
            <div className="eyebrow">Our Mission</div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To become one of the world's most trusted sunglasses manufacturing companies by delivering innovative
              products, reliable manufacturing, outstanding customer service, and scalable OEM solutions for businesses
              worldwide.
            </p>
          </div>
          <div className="card-luxe p-8">
            <div className="eyebrow">Our Vision</div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To empower brands globally through world-class eyewear manufacturing, helping businesses launch
              premium-quality sunglasses that compete successfully in domestic and international markets.
            </p>
          </div>
        </div>
      </section>

      <section className="section-surface py-24">
        <div className="container-luxe max-w-4xl text-center">
          <div className="eyebrow">Let's Build Your Sunglasses Brand</div>
          <h2 className="font-display mt-3">Complete manufacturing solutions, from design to delivery.</h2>
          <div className="rule-gold mt-6 mx-auto w-16" />
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
            Whether you're creating a premium fashion label, sourcing products for retail, or looking for a dependable
            OEM manufacturing partner, SunglassManufacturer.com is ready to help.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From design and sampling to production, branding, packaging, and global shipping, we provide complete
            manufacturing solutions under one roof. Partner with SunglassManufacturer.com and build your next successful
            eyewear collection with confidence.
          </p>
          <a href="/contact" className="btn-ink mt-10 inline-flex">
            Start a Project
          </a>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <div className="card-luxe p-7 flex flex-col">
      <div className="eyebrow">{eyebrow}</div>
      <h3 className="font-display mt-3 text-xl">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{intro}</p>
      <ul className="mt-5 space-y-2 flex-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
