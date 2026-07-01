import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { categories, products } from "@/lib/products";
import { blogPosts } from "@/lib/blog";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/collection", changefreq: "weekly", priority: "0.9" },
          { path: "/oem", changefreq: "monthly", priority: "0.9" },
          { path: "/customization", changefreq: "monthly", priority: "0.8" },
          { path: "/wholesale", changefreq: "monthly", priority: "0.8" },
          { path: "/industries", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          ...categories.map((c) => ({ path: `/category/${c.slug}`, changefreq: "weekly" as const, priority: "0.8" })),
          ...products.map((p) => ({ path: `/product/${p.code}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...blogPosts.map((b) => ({ path: `/blog/${b.slug}`, changefreq: "monthly" as const, priority: "0.6" })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
