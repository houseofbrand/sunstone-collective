import { Download, Eye, FileText, MessageCircle } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import classicPdf from "@/assets/catalogues/classic-collection-2026.pdf";
import edgePdf from "@/assets/catalogues/edge-collection-2026.pdf";
import elitePdf from "@/assets/catalogues/elite-collection-2026.pdf";

/**
 * 2026 collection catalogue cards. PDFs live in src/assets/catalogues and are
 * bundled by Vite — customers view or download them directly (no form), and
 * enquire on WhatsApp with the collection context pre-filled. Add/edit here.
 */
type Catalogue = { name: string; tag: string; description: string; file: string; size: string };

const CATALOGUES: Catalogue[] = [
  {
    name: "Classic Collection",
    tag: "2026 · Timeless",
    description: "Enduring aviators, wayfarers and rounds — the heritage silhouettes every private label starts with.",
    file: classicPdf,
    size: "20 MB",
  },
  {
    name: "Edge Collection",
    tag: "2026 · Contemporary",
    description: "Bold, modern frames — sport wraps, shields and statement geometry for brands with attitude.",
    file: edgePdf,
    size: "14 MB",
  },
  {
    name: "Elite Collection",
    tag: "2026 · Premium",
    description: "Our finest acetate and metal craftsmanship — elevated materials, finishes and detailing.",
    file: elitePdf,
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
            View or download the full 2026 line sheets — then message us on WhatsApp to enquire about
            OEM &amp; private label pricing for any collection.
          </p>
          <div className="rule-gold mt-6 w-16" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {CATALOGUES.map((c) => (
            <article key={c.file} className="card-luxe hover:card-luxe-hover p-7 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-md bg-secondary flex items-center justify-center text-royal">
                  <FileText size={22} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">PDF · {c.size}</span>
              </div>

              <div className="eyebrow mt-6">{c.tag}</div>
              <h3 className="font-display text-lg mt-1 text-foreground">{c.name}</h3>
              <p className="text-sm text-secondary-foreground mt-2 leading-relaxed flex-1">{c.description}</p>

              <div className="mt-6 flex flex-col gap-2.5">
                <div className="flex gap-2">
                  <a href={c.file} download className="btn-ink hover:btn-ink-hover flex-1" aria-label={`Download ${c.name} catalogue PDF`}>
                    <Download size={15} /> Download
                  </a>
                  <a href={c.file} target="_blank" rel="noreferrer" className="btn-outline-ink px-4 hover:bg-royal hover:text-white" aria-label={`View ${c.name} in browser`}>
                    <Eye size={15} /> View
                  </a>
                </div>
                <a
                  href={enquiryLink(c.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-[0.7rem] text-sm font-semibold text-[#0B1220] transition hover:brightness-95"
                  aria-label={`Enquire about ${c.name} on WhatsApp`}
                >
                  <MessageCircle size={15} /> Enquire on WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
