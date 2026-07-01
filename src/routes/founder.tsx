import { createFileRoute } from "@tanstack/react-router";
import { getFounder } from "@/lib/founder.functions";
import { FounderSection } from "@/components/site/FounderSection";

export const Route = createFileRoute("/founder")({
  loader: async () => ({ founder: await getFounder() }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.founder.name ?? "Rajan Mehta"} — ${loaderData?.founder.designation ?? "Founder & CEO"} | OEMSunglasses.com` },
      { name: "description", content: `Meet ${loaderData?.founder.name ?? "Rajan Mehta"}, ${loaderData?.founder.designation ?? "Founder & CEO"} of OEMSunglasses.com — 25+ years of OEM and private label manufacturing expertise across the global fashion accessories industry.` },
      { property: "og:title", content: `${loaderData?.founder.name ?? "Rajan Mehta"} — Founder, OEMSunglasses.com` },
      { property: "og:description", content: "25+ years pioneering OEM & private label manufacturing across sunglasses, watches, wallets, belts and lifestyle accessories." },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: loaderData?.founder.image_url },
    ],
    links: [{ rel: "canonical", href: "/founder" }],
  }),
  errorComponent: () => <div className="container-luxe py-24 text-center text-muted-foreground">Couldn't load founder profile.</div>,
  notFoundComponent: () => <div className="container-luxe py-24 text-center">Not found.</div>,
  component: FounderPage,
});

function FounderPage() {
  const { founder } = Route.useLoaderData();
  return (
    <>
      <FounderSection f={founder} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: founder.name,
            jobTitle: founder.designation,
            image: founder.image_url,
            url: founder.website_url,
            sameAs: [founder.linkedin_url, founder.instagram_url, founder.facebook_url, founder.youtube_url].filter(Boolean),
            description: founder.bio.slice(0, 300),
          }),
        }}
      />
    </>
  );
}
