import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE, waLink } from "@/lib/site";
import { useDialogs } from "./DialogsProvider";
import logoAsset from "@/assets/oem-sunglasses-logo.png.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collection" },
  { to: "/oem", label: "OEM" },
  { to: "/customization", label: "Customization" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/founder", label: "Founder" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { openCatalogue, openInquiry } = useDialogs();
  const onOpenCatalogue = openCatalogue;
  const onOpenInquiry = () => openInquiry();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background shadow-soft">
      <div className="container-luxe flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="OEMSunglasses.com home">
          <img src={logoAsset.url} alt="OEMSunglasses.com" className="h-12 md:h-14 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[13px] tracking-wide text-foreground hover:text-primary transition-colors"
              activeProps={{ className: "text-ink font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => openCatalogue()} className="btn-outline-ink hover:bg-ink hover:text-bone">Catalogue</button>
          <button onClick={onOpenInquiry} className="btn-gold">Get Quote</button>
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
              <button onClick={() => { setOpen(false); openCatalogue(); }} className="btn-outline-ink">Download Catalogue</button>
              <button onClick={() => { setOpen(false); onOpenInquiry(); }} className="btn-gold">Get OEM Quote</button>
              <a href={waLink(`Hello ${SITE.name}, I'd like to inquire about OEM sunglasses.`)} target="_blank" rel="noreferrer" className="btn-ink">WhatsApp Now</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
