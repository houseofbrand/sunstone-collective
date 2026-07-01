import { Link } from "@tanstack/react-router";
import { SITE, waLink } from "@/lib/site";
import { Mail, MessageCircle, Download } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import logoAsset from "@/assets/oem-sunglasses-logo.png.asset.json";

export function Footer() {
  const { openCatalogue } = useDialogs();
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
        <div>
          <img src={logoAsset.url} alt="OEMSunglasses.com" className="h-14 w-auto mb-4 brightness-0 invert" />
          <p className="text-sm leading-relaxed text-white/90">
            India's trusted OEM sunglasses manufacturing partner. Private label, custom logo, low MOQ from 12 pieces, worldwide shipping.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/collection">Collection</Link></li>
            <li><Link to="/oem">OEM Process</Link></li>
            <li><Link to="/customization">Customization</Link></li>
            <li><Link to="/wholesale">Wholesale</Link></li>
            <li><Link to="/industries">Industries</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Journal</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-4">Get in touch</div>
          <a href={waLink("Hello, I'd like an OEM sunglasses quote.")} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm">
            <MessageCircle size={16} className="text-gold" /> {SITE.whatsapp}
          </a>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-sm mt-2">
            <Mail size={16} className="text-gold" /> {SITE.email}
          </a>
          <p className="text-xs text-white/80 mt-6">MOQ 12 pieces · Worldwide export · Custom branding</p>
          <button
            onClick={() => openCatalogue()}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/40 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gold hover:border-gold hover:text-ink"
          >
            <Download size={14} /> Download Catalogue
          </button>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-luxe py-5 text-xs text-white/80 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} OEMSunglasses.com — All rights reserved.</span>
          <span>OEM · Private Label · White Label · Wholesale</span>
        </div>
      </div>
    </footer>
  );
}
