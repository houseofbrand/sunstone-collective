import { Link } from "@tanstack/react-router";
import { SITE, waLink } from "@/lib/site";
import { Mail, MessageCircle, Download } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import logoAsset from "@/assets/oem-sunglasses-logo.png.asset.json";

export function Footer() {
  const { openCatalogue } = useDialogs();
  return (
    <footer className="mt-24 border-t border-border bg-background text-foreground">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
        <div>
          <img src={logoAsset.url} alt="OEMSunglasses.com" className="h-14 w-auto mb-4" />
          <p className="text-sm text-secondary-foreground leading-relaxed">
            India's trusted OEM sunglasses manufacturing partner. Private label, custom logo, low MOQ from 12 pieces, worldwide shipping.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/collection" className="text-primary hover:text-blue-700 underline-offset-4">Collection</Link></li>
            <li><Link to="/oem" className="text-primary hover:text-blue-700 underline-offset-4">OEM Process</Link></li>
            <li><Link to="/customization" className="text-primary hover:text-blue-700 underline-offset-4">Customization</Link></li>
            <li><Link to="/wholesale" className="text-primary hover:text-blue-700 underline-offset-4">Wholesale</Link></li>
            <li><Link to="/industries" className="text-primary hover:text-blue-700 underline-offset-4">Industries</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-primary hover:text-blue-700 underline-offset-4">About</Link></li>
            <li><Link to="/blog" className="text-primary hover:text-blue-700 underline-offset-4">Journal</Link></li>
            <li><Link to="/contact" className="text-primary hover:text-blue-700 underline-offset-4">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-4">Get in touch</div>
          <a href={waLink("Hello, I'd like an OEM sunglasses quote.")} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:text-blue-700 underline-offset-4">
            <MessageCircle size={16} /> {SITE.whatsapp}
          </a>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-sm text-primary hover:text-blue-700 underline-offset-4 mt-2">
            <Mail size={16} /> {SITE.email}
          </a>
          <p className="text-xs text-muted-foreground mt-6">MOQ 12 pieces · Worldwide export · Custom branding</p>
          <button onClick={() => openCatalogue()} className="btn-outline-ink mt-4 inline-flex hover:bg-ink hover:text-bone">
            <Download size={14} /> Download Catalogue
          </button>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-luxe py-5 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} OEMSunglasses.com — All rights reserved.</span>
          <span>OEM · Private Label · White Label · Wholesale</span>
        </div>
      </div>
    </footer>
  );
}
