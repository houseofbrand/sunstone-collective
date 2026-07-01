import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "OEM Sunglasses Journal — Guides for Brands & Buyers | OEMSunglasses.com" },
      { name: "description", content: "Insights and guides on OEM sunglasses manufacturing, private label branding, wholesale buying, custom logo printing and launching your own eyewear brand." },
      { property: "og:title", content: "OEM Sunglasses Journal" },
      { property: "og:description", content: "Guides for eyewear brands, retailers and buyers." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

function BlogIndex() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Journal" }]} />
      <header className="container-luxe pt-8 pb-14 max-w-3xl">
        <div className="eyebrow">Journal</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3">Guides for eyewear brands & buyers.</h1>
        <div className="rule-gold mt-6 w-16" />
      </header>
      <section className="container-luxe pb-24 grid md:grid-cols-2 gap-x-10 gap-y-12">
        {blogPosts.map((p) => (
          <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group block">
            <div className="eyebrow">{p.category}</div>
            <h2 className="font-display text-2xl mt-2 group-hover:text-primary transition-colors">{p.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
            <div className="mt-4 text-xs text-muted-foreground">{p.readTime} min read</div>
          </Link>
        ))}
      </section>
    </>
  );
}
