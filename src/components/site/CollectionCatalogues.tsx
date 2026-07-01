import { Download, Eye, MessageCircle } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import classicPdf from "@/assets/catalogues/classic-collection-2026.pdf";
import edgePdf from "@/assets/catalogues/edge-collection-2026.pdf";
import elitePdf from "@/assets/catalogues/elite-collection-2026.pdf";
import classicCover from "@/assets/catalogues/classic-collection-2026-cover.jpg";
import edgeCover from "@/assets/catalogues/edge-collection-2026-cover.jpg";
import eliteCover from "@/assets/catalogues/elite-collection-2026-cover.jpg";

/**
 * 2026 collection catalogue cards. PDFs + cover thumbnails live in
 * src/assets/catalogues and are bundled by Vite. Clicking the thumbnail (or
 * title) opens the PDF directly; the round button downloads it; and the
 * WhatsApp button enquires with the collection context pre-filled. Add/edit here.
 */
type Catalogue = { name: string; tag: string; description: string; file: string; cover: string; size: string };

const CATALOGUES: Catalogue[] = [
  {
    name: "Classic Collection",
    tag: "2026 · Timeless",
    description: "Enduring aviators, wayfarers and rounds — the heritage silhouettes every private label starts with.",
    file: classicPdf,
    cover: classicCover,
    size: "20 MB",
  },
  {
    name: "Edge Collection",
    tag: "2026 · Contemporary",
    description: "Bold, modern frames — sport wraps, shields and statement geometry for brands with attitude.",
    file: edgePdf,
    cover: edgeCover,
    size: "14 MB",
  },
  {
    name: "Elite Collection",
    tag: "2026 · Premium",
    description: "Our finest acetate and metal craftsmanship — elevated materials, finishes and detailing.",
    file: elitePdf,
    cover: eliteCover,
    size: "8 MB",
  },
];

const enquiryLink = (name: string) =>
  waLink(`Hello ${SITE.name}, I'm interested in the ${name} (2026) and would like to enquire about your OEM sunglasses. Please share pricing, MOQ and customization details.`);

export function CollectionCatalogues() {
  return (
    <section className="section-surface border-t border-border">
      <div className="container-luxe py-16 md:py-20">
        <div className="max-w-2xl">
          <div className="eyebrow">Download · 2026 Catalogues</div>
          <h2 className="font-display text-3xl md:text-4xl mt-3">Explore our latest collection catalogues.</h2>
          <p className="mt-4 text-secondary-foreground">
            Click a catalogue to view it, download the PDF, or message us on WhatsApp to enquire about
            OEM &amp; private label pricing for any collection.
          </p>
          <div className="rule-gold mt-6 w-16" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {CATALOGUES.map((c) => (
            <article key={c.file} className="card-luxe hover:card-luxe-hover overflow-hidden flex flex-col">
              {/* Thumbnail — click opens the PDF directly */}
              <a
                href={c.file}
                target="_blank"
                rel="noreferrer"
                className="group/thumb relative block aspect-[3/2] overflow-hidden bg-secondary"
                aria-label={`Open ${c.name} catalogue`}
              >
                <img
                  src={c.cover}
                  alt={`${c.name} 2026 catalogue cover`}
                  loading="lazy"
                  width={900}
                  height={596}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                />
                <span className="absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
                  PDF · {c.size}
                </span>
                <span className="absolute inset-0 grid place-items-center bg-ink/45 opacity-0 transition-opacity group-hover/thumb:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-ink">
                    <Eye size={15} /> View catalogue
                  </span>
                </span>
              </a>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="eyebrow">{c.tag}</div>
                <h3 className="font-display text-lg mt-1">
                  <a href={c.file} target="_blank" rel="noreferrer" className="text-foreground hover:text-royal">{c.name}</a>
                </h3>
                <p className="text-sm text-secondary-foreground mt-2 leading-relaxed flex-1">{c.description}</p>

                {/* Actions — round download + WhatsApp on one line */}
                <div className="mt-5 flex items-center gap-3">
                  <a
                    href={c.file}
                    download
                    className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-royal text-white shadow-soft transition hover:bg-[#1D4ED8]"
                    aria-label={`Download ${c.name} PDF`}
                    title="Download PDF"
                  >
                    <Download size={18} />
                  </a>
                  <a
                    href={enquiryLink(c.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-[0.7rem] text-sm font-semibold text-[#0B1220] transition hover:brightness-95"
                    aria-label={`Enquire about ${c.name} on WhatsApp`}
                  >
                    <MessageCircle size={16} /> Enquire on WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
