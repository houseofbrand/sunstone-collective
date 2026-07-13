import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDialogs } from "@/components/site/DialogsProvider";
import { SITE, waLink } from "@/lib/site";
import { Mail, MessageCircle, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact OEMSunglasses.com | OEM & Wholesale Sunglasses Inquiries" },
      { name: "description", content: "Contact OEMSunglasses.com for OEM manufacturing, private label, wholesale and export inquiries. WhatsApp, email or submit your requirements online." },
      { property: "og:title", content: "Contact OEMSunglasses.com" },
      { property: "og:description", content: "OEM, private label & wholesale sunglasses inquiries." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const { openCatalogRequest } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
      <header className="container-luxe pt-8 pb-14 max-w-3xl">
        <div className="eyebrow">Get in touch</div>
        <h1 className="font-display text-4xl md:text-5xl mt-3">Let's discuss your project.</h1>
        <div className="rule-gold mt-6 w-16" />
        <p className="mt-6 text-muted-foreground">Reach us on WhatsApp for the fastest response, or submit a detailed inquiry and our team will respond within one working day.</p>
      </header>
      <section className="container-luxe pb-24 grid md:grid-cols-3 gap-6">
        <a href={waLink("Hello, I'd like to discuss OEM sunglasses.")} target="_blank" rel="noreferrer" className="border border-border p-8 bg-card hover:border-gold transition-colors">
          <MessageCircle className="text-gold" />
          <div className="eyebrow mt-4">WhatsApp</div>
          <div className="font-display text-xl mt-1">{SITE.whatsapp}</div>
          <p className="text-sm text-muted-foreground mt-2">Fastest response · Mon–Sat</p>
        </a>
        <a href={`mailto:${SITE.email}`} className="border border-border p-8 bg-card hover:border-gold transition-colors">
          <Mail className="text-gold" />
          <div className="eyebrow mt-4">Email</div>
          <div className="font-display text-xl mt-1">{SITE.email}</div>
          <p className="text-sm text-muted-foreground mt-2">For OEM, private label and export queries</p>
        </a>
        <div className="border border-border p-8 bg-card">
          <MapPin className="text-gold" />
          <div className="eyebrow mt-4">Location</div>
          <div className="font-display text-xl mt-1">India</div>
          <p className="text-sm text-muted-foreground mt-2">Serving 40+ countries worldwide</p>
        </div>
      </section>
      <section className="container-luxe pb-24 text-center">
        <button onClick={() => openCatalogRequest({ category: "Sunglasses", source: "contact_page" })} className="btn-gold rounded-lg hover:brightness-95">Request OEM Catalog</button>
      </section>
    </>
  );
}
