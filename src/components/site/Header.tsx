import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { SITE, waLink } from "@/lib/site";
import { useDialogs } from "./DialogsProvider";
import logoAsset from "@/assets/oem-sunglasses-logo.png.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Products" },
  { to: "/oem", label: "OEM Manufacturing" },
  { to: "/customization", label: "Custom Branding" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { openCatalogue, openInquiry } = useDialogs();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 shadow-soft">
      <div className="container-luxe flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="flex items-center shrink-0" aria-label="OEMSunglasses.com home">
          <img src={logoAsset.url} alt="OEMSunglasses.com" className="h-10 md:h-11 w-auto" />
        </Link>

        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-royal rounded-md transition-colors"
              activeProps={{ className: "text-royal" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => openCatalogue()}
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-royal rounded-md transition-colors"
          >
            Download Catalogue
          </button>
        </nav>

        <div className="hidden xl:flex items-center gap-2 shrink-0">
          <button onClick={() => openInquiry()} className="btn-ink hover:btn-ink-hover">Get Quote</button>
          <a
            href={waLink(`Hello ${SITE.name}, I'd like to inquire about OEM sunglasses.`)}
            target="_blank"
            rel="noreferrer"
            className="btn-outline-ink hover:bg-royal hover:text-white"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>

        <button className="xl:hidden p-2 text-foreground" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background">
          <div className="container-luxe py-5 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-2.5 px-2 rounded-md hover:bg-secondary text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); openCatalogue(); }}
              className="text-sm font-medium py-2.5 px-2 rounded-md hover:bg-secondary text-left text-foreground"
            >
              Download Catalogue
            </button>
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
              <button onClick={() => { setOpen(false); openInquiry(); }} className="btn-ink">Get Quote</button>
              <a
                href={waLink(`Hello ${SITE.name}, I'd like to inquire about OEM sunglasses.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-outline-ink"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
