import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findCategory, productsByCategory, products } from "@/lib/products";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = findCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.cat.name} — Wholesale & OEM | OEMSunglasses.com` },
      { name: "description", content: `${loaderData.cat.description} Low MOQ from ${SITE.moq} pieces. Custom logo, private label & worldwide export.` },
      { property: "og:title", content: `${loaderData.cat.name} — Wholesale & OEM` },
      { property: "og:description", content: loaderData.cat.description },
      { property: "og:url", content: `/category/${loaderData.cat.slug}` },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/category/${loaderData.cat.slug}` }] : [],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-luxe py-24 text-center">
      <h1 className="font-display text-3xl">Category not found</h1>
      <Link to="/collection" className="btn-ink mt-6 inline-flex">Back to collection</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="container-luxe py-24 text-center"><p>{error.message}</p></div>,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const { openInquiry } = useDialogs();
  const list = productsByCategory(cat.slug);
  const showcase = list.length > 0 ? list : products.slice(0, 6);
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collection", to: "/collection" }, { label: cat.name }]} />
      <header className="container-luxe pt-8 pb-14">
        <div className="eyebrow">Category</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3">{cat.name}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{cat.description}</p>
        <div className="rule-gold mt-6 w-16" />
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => openInquiry({ category: cat.name })} className="btn-gold hover:brightness-95">Get Wholesale Quote</button>
          <Link to="/customization" className="btn-outline-ink hover:bg-ink hover:text-bone">Customization Options</Link>
        </div>
      </header>
      <section className="container-luxe pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {showcase.map((p) => (
          <Link key={p.code} to="/product/$code" params={{ code: p.code }} className="group block">
            <div className="aspect-square overflow-hidden bg-secondary">
              <img src={p.image} alt={p.name} loading="lazy" width={900} height={900} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="mt-4">
              <div className="eyebrow">{p.code}</div>
              <div className="font-display text-lg mt-1 group-hover:text-gold">{p.name}</div>
              <div className="text-sm text-muted-foreground mt-1">₹{p.price} · MOQ {SITE.moq} pcs</div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
