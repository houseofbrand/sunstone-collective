import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicProductByCode, listPublicProducts } from "@/lib/products.functions";
import { findCategory, productPrimaryImage, type Product } from "@/lib/products";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE, waLink } from "@/lib/site";
import { MessageCircle, Send, ShoppingBag, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/product/$code")({
  loader: async ({ params }) => {
    const p = (await getPublicProductByCode({ data: { code: params.code } })) as Product | null;
    if (!p) throw notFound();
    const all = (await listPublicProducts()) as Product[];
    return { p, all };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const img = productPrimaryImage(loaderData.p);
    return {
      meta: [
        { title: `${loaderData.p.name} (${loaderData.p.code}) — Wholesale OEM | OEMSunglasses.com` },
        { name: "description", content: `${loaderData.p.name} — ${loaderData.p.frame_material}, ${loaderData.p.lens_material}. Wholesale price ₹${loaderData.p.price}, MOQ ${SITE.moq} pieces. OEM, private label & custom logo available.` },
        { property: "og:title", content: `${loaderData.p.name} — Wholesale OEM Sunglasses` },
        { property: "og:description", content: `${loaderData.p.frame_material} · ${loaderData.p.lens_material} · MOQ ${SITE.moq} pieces.` },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${loaderData.p.code}` },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
      links: [{ rel: "canonical", href: `/product/${loaderData.p.code}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: loaderData.p.name,
          sku: loaderData.p.code,
          image: img ? [img] : undefined,
          description: `${loaderData.p.frame_material}, ${loaderData.p.lens_material}, UV400 protected. Wholesale OEM sunglasses.`,
          offers: { "@type": "Offer", priceCurrency: "INR", price: loaderData.p.price, availability: "https://schema.org/InStock" },
        }),
      }],
    };
  },
  component: ProductPage,
  notFoundComponent: () => <div className="container-luxe py-24 text-center"><h1 className="font-display text-3xl">Product not found</h1><Link to="/collection" className="btn-ink mt-6 inline-flex">Back to collection</Link></div>,
  errorComponent: ({ error }) => <div className="container-luxe py-24 text-center"><p>{error.message}</p></div>,
});

function ProductPage() {
  const { p, all } = Route.useLoaderData();
  const { openInquiry, openCatalogue } = useDialogs();
  const cat = findCategory(p.category_slug);
  const related = all.filter((x: Product) => x.category_slug === p.category_slug && x.code !== p.code).slice(0, 4);
  const primary = productPrimaryImage(p);
  const [active, setActive] = useState<string | null>(primary);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collection", to: "/collection" }, { label: cat?.name || "Category", to: cat ? `/category/${cat.slug}` : undefined }, { label: p.name }]} />
      <section className="container-luxe pt-8 pb-20 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square overflow-hidden bg-secondary">
            {active ? (
              <img src={active} alt={p.name} width={900} height={900} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">No image available</div>
            )}
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images.map((im: Product["images"][number]) => (
                <button
                  key={im.id}
                  onClick={() => setActive(im.url)}
                  className={`aspect-square overflow-hidden border ${active === im.url ? "border-gold" : "border-border"}`}
                  aria-label="View image"
                >
                  <img src={im.url} alt={im.alt_text || p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="eyebrow">{p.code}</div>
          <h1 className="font-display text-4xl mt-2">{p.name}</h1>
          <div className="rule-gold my-5 w-16" />
          <div className="flex items-baseline gap-4">
            <div className="font-display text-3xl text-ink">₹{p.price}</div>
            <div className="text-sm text-muted-foreground">Wholesale · MOQ {SITE.moq} pcs</div>
          </div>
          {p.description && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.description}</p>}
          <dl className="mt-8 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <Row k="Frame Material" v={p.frame_material} />
            <Row k="Lens Material" v={p.lens_material} />
            <Row k="Protection" v="UV400" />
            <Row k="Weight" v={p.weight} />
            <Row k="MOQ" v={`${SITE.moq} pieces`} />
            <Row k="Delivery" v="15–30 days" />
            <Row k="Packaging" v="Soft pouch + cloth (customisable)" />
            <Row k="Customization" v="Logo, colour, lens tint, packaging" />
          </dl>
          {p.colours.length > 0 && (
            <div className="mt-6">
              <div className="eyebrow mb-2">Available Colours</div>
              <div className="flex flex-wrap gap-2">
                {p.colours.map((c: string) => <span key={c} className="border border-border px-3 py-1 text-xs">{c}</span>)}
              </div>
            </div>
          )}
          <div className="mt-10 grid grid-cols-2 gap-3">
            <button onClick={() => openInquiry({ productCode: p.code, category: cat?.name })} className="btn-gold"><ShoppingBag size={14} /> Get OEM Quote</button>
            <button onClick={() => openInquiry({ productCode: p.code, category: cat?.name })} className="btn-outline-ink hover:bg-ink hover:text-bone"><Send size={14} /> Request Sample</button>
            <button onClick={() => openCatalogue(p.category_slug)} className="btn-outline-ink hover:bg-ink hover:text-bone col-span-2"><Download size={14} /> Download Catalogue</button>
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
            {related.map((r: Product) => {
              const rimg = productPrimaryImage(r);
              return (
                <Link key={r.code} to="/product/$code" params={{ code: r.code }} className="group block">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    {rimg ? (
                      <img src={rimg} alt={r.name} loading="lazy" width={900} height={900} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">No image</div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="eyebrow">{r.code}</div>
                    <div className="font-display text-base mt-1 group-hover:text-primary">{r.name}</div>
                  </div>
                </Link>
              );
            })}
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
