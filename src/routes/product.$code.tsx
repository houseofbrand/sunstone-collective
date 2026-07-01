import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findProduct, products, findCategory } from "@/lib/products";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE, waLink } from "@/lib/site";
import { MessageCircle, Send, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/product/$code")({
  loader: ({ params }) => {
    const p = findProduct(params.code);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.p.name} (${loaderData.p.code}) — Wholesale OEM | OEMSunglasses.com` },
      { name: "description", content: `${loaderData.p.name} — ${loaderData.p.frameMaterial}, ${loaderData.p.lensMaterial}. Wholesale price ₹${loaderData.p.price}, MOQ ${SITE.moq} pieces. OEM, private label & custom logo available.` },
      { property: "og:title", content: `${loaderData.p.name} — Wholesale OEM Sunglasses` },
      { property: "og:description", content: `${loaderData.p.frameMaterial} · ${loaderData.p.lensMaterial} · MOQ ${SITE.moq} pieces.` },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/product/${loaderData.p.code}` },
      { property: "og:image", content: loaderData.p.image },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/product/${loaderData.p.code}` }] : [],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: loaderData.p.name,
        sku: loaderData.p.code,
        description: `${loaderData.p.frameMaterial}, ${loaderData.p.lensMaterial}, UV400 protected. Wholesale OEM sunglasses.`,
        offers: { "@type": "Offer", priceCurrency: "INR", price: loaderData.p.price, availability: "https://schema.org/InStock" },
      }),
    }] : [],
  }),
  component: ProductPage,
  notFoundComponent: () => <div className="container-luxe py-24 text-center"><h1 className="font-display text-3xl">Product not found</h1><Link to="/collection" className="btn-ink mt-6 inline-flex">Back to collection</Link></div>,
  errorComponent: ({ error }) => <div className="container-luxe py-24 text-center"><p>{error.message}</p></div>,
});

function ProductPage() {
  const { p } = Route.useLoaderData();
  const { openInquiry } = useDialogs();
  const cat = findCategory(p.category);
  const related = products.filter((x) => x.category === p.category && x.code !== p.code).slice(0, 4);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collection", to: "/collection" }, { label: cat?.name || "Category", to: cat ? `/category/${cat.slug}` : undefined }, { label: p.name }]} />
      <section className="container-luxe pt-8 pb-20 grid lg:grid-cols-2 gap-12">
        <div className="aspect-square overflow-hidden bg-secondary">
          <img src={p.image} alt={p.name} width={900} height={900} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="eyebrow">{p.code}</div>
          <h1 className="font-display text-4xl mt-2">{p.name}</h1>
          <div className="rule-gold my-5 w-16" />
          <div className="flex items-baseline gap-4">
            <div className="font-display text-3xl text-ink">₹{p.price}</div>
            <div className="text-sm text-muted-foreground">Wholesale · MOQ {SITE.moq} pcs</div>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <Row k="Frame Material" v={p.frameMaterial} />
            <Row k="Lens Material" v={p.lensMaterial} />
            <Row k="Protection" v="UV400" />
            <Row k="Weight" v={p.weight} />
            <Row k="MOQ" v={`${SITE.moq} pieces`} />
            <Row k="Delivery" v="15–30 days" />
            <Row k="Packaging" v="Soft pouch + cloth (customisable)" />
            <Row k="Customization" v="Logo, colour, lens tint, packaging" />
          </dl>
          <div className="mt-6">
            <div className="eyebrow mb-2">Available Colours</div>
            <div className="flex flex-wrap gap-2">
              {p.colours.map((c) => <span key={c} className="border border-border px-3 py-1 text-xs">{c}</span>)}
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <button onClick={() => openInquiry({ productCode: p.code, category: cat?.name })} className="btn-gold hover:brightness-95"><ShoppingBag size={14} /> Get OEM Quote</button>
            <button onClick={() => openInquiry({ productCode: p.code, category: cat?.name })} className="btn-outline-ink hover:bg-ink hover:text-bone"><Send size={14} /> Request Sample</button>
            <a href={waLink(`Hi, I'm interested in ${p.name} (${p.code}). Please share wholesale pricing & customisation options.`)} target="_blank" rel="noreferrer" className="btn-ink hover:brightness-110 col-span-2"><MessageCircle size={14} /> WhatsApp Inquiry</a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-luxe pb-24">
          <div className="eyebrow">You may also like</div>
          <h2 className="font-display text-2xl mt-2">More from {cat?.name}</h2>
          <div className="rule-gold mt-4 w-16" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {related.map((r) => (
              <Link key={r.code} to="/product/$code" params={{ code: r.code }} className="group block">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img src={r.image} alt={r.name} loading="lazy" width={900} height={900} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="mt-3">
                  <div className="eyebrow">{r.code}</div>
                  <div className="font-display text-base mt-1 group-hover:text-gold">{r.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="eyebrow text-muted-foreground">{k}</dt>
      <dd className="text-ink">{v}</dd>
    </>
  );
}
