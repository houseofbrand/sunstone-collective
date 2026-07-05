import { Link } from "@tanstack/react-router";
import { SITE, waLink } from "@/lib/site";
import { Mail, MessageCircle, Download, MapPin, Phone, Linkedin, Instagram, Facebook } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import logoAsset from "@/assets/oem-sunglasses-logo-transparent.png.asset.json";

export function Footer() {
  const { openCatalogue, openInquiry } = useDialogs();
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-luxe pt-16 pb-10 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <img src={logoAsset.url} alt="OEMSunglasses.com" className="h-11 w-auto mb-5 brightness-0 invert" />
          <p className="text-sm leading-relaxed text-white/85 max-w-sm">
            India's trusted OEM sunglasses manufacturing partner. Private label, custom logo, low MOQ from 12 pieces, worldwide shipping to 40+ countries.
          </p>
          <div className="mt-6 space-y-2 text-sm text-white/85">
            <a href={waLink("Hello, I'd like an OEM sunglasses quote.")} target="_blank" rel="noreferrer" className="flex items-center gap-2.5">
              <Phone size={15} className="text-gold" /> {SITE.whatsapp}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5">
              <Mail size={15} className="text-gold" /> {SITE.email}
            </a>
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-gold mt-0.5 shrink-0" /> <span>Manufacturing facility · India</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold mb-4">Quick Links</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/collection">Products</Link></li>
            <li><Link to="/oem">OEM Manufacturing</Link></li>
            <li><Link to="/customization">Custom Branding</Link></li>
            <li><Link to="/wholesale">Wholesale</Link></li>
            <li><Link to="/industries">Industries</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold mb-4">Company</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/founder">Founder</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold mb-4">Get Started</div>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => openInquiry()} className="btn-ink hover:btn-ink-hover w-full justify-center">
              Get a Quote
            </button>
            <button
              onClick={() => openCatalogue()}
              className="btn-outline-bone hover:bg-white hover:text-ink w-full justify-center"
            >
              <Download size={14} /> Catalogue
            </button>
            <a
              href={waLink("Hello, I'd like an OEM sunglasses quote.")}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-bone hover:bg-white hover:text-ink w-full justify-center"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-luxe py-5 text-xs text-white/75 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© {new Date().getFullYear()} OEMSunglasses.com — All rights reserved.</span>
          <span className="text-center">OEM · Private Label · White Label · Wholesale</span>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="LinkedIn" className="hover:text-gold"><Linkedin size={16} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-gold"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gold"><Facebook size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
