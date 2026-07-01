import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/products";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
  head: () => ({
    meta: [
      { title: "Wholesale Sunglasses Collection | OEM & Private Label — OEMSunglasses.com" },
      { name: "description", content: "Browse our full wholesale sunglasses collection — aviator, round, square, cat eye, sports, polarized, luxury and promotional. Low MOQ, custom logo, worldwide export." },
      { property: "og:title", content: "Wholesale Sunglasses Collection" },
      { property: "og:description", content: "Aviator, round, square, cat eye, sports, polarized and more — OEM & private label wholesale." },
      { property: "og:url", content: "/collection" },
    ],
    links: [{ rel: "canonical", href: "/collection" }],
  }),
});

function CollectionPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collection" }]} />
      <header className="container-luxe pt-8 pb-14">
        <div className="eyebrow">Wholesale Collection</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3 max-w-3xl">Every silhouette. Every material. Ready for your brand.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Explore our full OEM & private label sunglasses range — from timeless aviators and editorial cat eyes to performance wraps and driving lenses.</p>
        <div className="rule-gold mt-6 w-16" />
      </header>
      <section className="container-luxe pb-24 grid grid-cols-2 md:grid-cols-3 gap-5">
        {categories.map((c) => (
          <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group block relative overflow-hidden bg-secondary aspect-[4/5]">
            <img src={c.image} alt={c.name} loading="lazy" width={900} height={1125} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-primary text-primary-foreground p-6">
              <div className="eyebrow text-bone">{c.short}</div>
              <div className="font-display text-xl mt-1">{c.name}</div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
