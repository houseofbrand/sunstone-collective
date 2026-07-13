import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import customImg from "@/assets/brand-every-detail.png";
import { useDialogs } from "@/components/site/DialogsProvider";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/customization")({
  component: CustomPage,
  head: () => ({
    meta: [
      { title: "Custom Logo Sunglasses & Private Label Options | OEMSunglasses.com" },
      { name: "description", content: "Laser engraving, pad printing, doming, metal badges, custom lens tints, custom packaging, gift boxes and private label branding for OEM sunglasses." },
      { property: "og:title", content: "Custom Logo Sunglasses & Private Label Options" },
      { property: "og:description", content: "Every surface, brandable. Temple, lens, case, cloth, pouch, box." },
      { property: "og:url", content: "/customization" },
    ],
    links: [{ rel: "canonical", href: "/customization" }],
  }),
});

const groups = [
  {
    title: "Frame Branding",
    items: ["Temple Logo Printing", "Laser Engraving", "Metal Logo Badge", "Doming Sticker", "Colour-Matched Rivets"],
  },
  {
    title: "Lens Branding",
    items: ["Corner Lens Print", "Custom Lens Tint", "Mirror Coating", "Gradient Lenses", "Photochromic Lenses"],
  },
  {
    title: "Packaging & Accessories",
    items: ["Hard Case Printing", "Soft Pouch Printing", "Cleaning Cloth Branding", "Custom Gift Box", "Barcode Stickers", "Warranty Card", "Brand Insert"],
  },
  {
    title: "Custom Development",
    items: ["Custom Colour Development", "Custom Frame Tooling", "Custom Lens Formula", "OEM Packaging Design", "Private Label Branding"],
  },
];

function CustomPage() {
  const { openInquiry, openCatalogue } = useDialogs();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Customization" }]} />
      <header className="container-luxe pt-8 pb-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="eyebrow">Private Label & Customization</div>
          <h1 className="font-display text-4xl md:text-5xl mt-3">Every surface, <span className="text-gold italic font-normal">brandable.</span></h1>
          <p className="mt-5 text-muted-foreground max-w-xl">From your logo on the temple to a fully custom gift box on arrival — we execute private label at every scale.</p>
          <div className="rule-gold mt-6 w-16" />
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => openInquiry()} className="btn-gold hover:brightness-95">Discuss Customization</button>
            <button onClick={() => openCatalogue()} className="btn-outline-ink hover:bg-ink hover:text-bone">Download Catalogue</button>
          </div>
        </div>
        <div className="aspect-[1402/1122] overflow-hidden">
          <img src={customImg} alt="Sunglasses branding and logo printing options" loading="lazy" width={1402} height={1122} className="w-full h-full object-cover" />
        </div>
      </header>

      <section className="container-luxe pb-24 grid md:grid-cols-2 gap-10">
        {groups.map((g) => (
          <div key={g.title} className="border border-border p-8 bg-card">
            <div className="eyebrow text-gold">{g.title}</div>
            <ul className="mt-5 space-y-3">
              {g.items.map((i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Sparkles size={14} className="text-gold shrink-0" /> {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
