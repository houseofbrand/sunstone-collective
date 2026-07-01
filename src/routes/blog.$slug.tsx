import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { findPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = findPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.post.title} | OEMSunglasses.com Journal` },
      { name: "description", content: loaderData.post.excerpt },
      { property: "og:title", content: loaderData.post.title },
      { property: "og:description", content: loaderData.post.excerpt },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${loaderData.post.slug}` },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/blog/${loaderData.post.slug}` }] : [],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: loaderData.post.title,
        description: loaderData.post.excerpt,
        articleSection: loaderData.post.category,
      }),
    }] : [],
  }),
  component: BlogPost,
  notFoundComponent: () => <div className="container-luxe py-24 text-center"><h1 className="font-display text-3xl">Article not found</h1><Link to="/blog" className="btn-ink mt-6 inline-flex">Back to journal</Link></div>,
  errorComponent: ({ error }) => <div className="container-luxe py-24 text-center"><p>{error.message}</p></div>,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Journal", to: "/blog" }, { label: post.title }]} />
      <article className="container-luxe pt-8 pb-24 max-w-3xl">
        <div className="eyebrow">{post.category}</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3">{post.title}</h1>
        <div className="rule-gold mt-6 w-16" />
        <div className="mt-6 text-xs text-muted-foreground">{post.readTime} min read</div>
        <div className="prose prose-neutral mt-10 space-y-6 text-foreground/85 leading-relaxed">
          {post.body.map((para, i) => (
            para.startsWith("## ") ? (
              <h2 key={i} className="font-display text-2xl mt-8">{para.replace("## ", "")}</h2>
            ) : (
              <p key={i}>{para}</p>
            )
          ))}
        </div>
      </article>
    </>
  );
}
