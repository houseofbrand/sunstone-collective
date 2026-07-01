import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE, waLink } from "@/lib/site";

const nav = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collection" },
  { to: "/oem", label: "OEM" },
  { to: "/customization", label: "Customization" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header({ onOpenCatalogue, onOpenInquiry }: { onOpenCatalogue: () => void; onOpenInquiry: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-luxe flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-ink text-ink font-display text-lg">O</span>
          <span className="font-display text-lg tracking-tight text-ink">OEM<span className="text-gold">Sunglasses</span></span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[13px] tracking-wide text-foreground/80 hover:text-ink transition-colors"
              activeProps={{ className: "text-ink font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={onOpenCatalogue} className="btn-outline-ink hover:bg-ink hover:text-bone">Catalogue</button>
          <button onClick={onOpenInquiry} className="btn-gold hover:brightness-95">Get Quote</button>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="container-luxe py-6 flex flex-col gap-4">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-sm py-1">{n.label}</Link>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-border">
              <button onClick={() => { setOpen(false); onOpenCatalogue(); }} className="btn-outline-ink">Download Catalogue</button>
              <button onClick={() => { setOpen(false); onOpenInquiry(); }} className="btn-gold">Get OEM Quote</button>
              <a href={waLink(`Hello ${SITE.name}, I'd like to inquire about OEM sunglasses.`)} target="_blank" rel="noreferrer" className="btn-ink">WhatsApp Now</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
