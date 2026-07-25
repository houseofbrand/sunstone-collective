import { Link } from "@tanstack/react-router";
import { SITE, waLink } from "@/lib/site";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";
import { useDialogs } from "./DialogsProvider";

export function Footer() {
  const { openCatalogRequest } = useDialogs();
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-luxe pt-16 pb-10 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-5 text-xl font-extrabold tracking-[-0.03em] text-white">
            SUNGLASS<span className="text-[#4C84F5]">MANUFACTURER</span>
            <span className="text-[10px] tracking-[0.14em] text-white/55">.COM</span>
          </div>
          <p className="text-sm leading-relaxed text-white/85 max-w-sm">
            An experienced OEM and private-label eyewear partner for brands, retailers,
            distributors, e-commerce businesses and sourcing teams in India and international
            markets.
          </p>
          <div className="mt-6 space-y-2 text-sm text-white/85">
            <a
              href={waLink("Hello, I'd like an OEM sunglasses quote.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5"
            >
              <Phone size={15} className="text-gold" /> {SITE.whatsapp}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5">
              <Mail size={15} className="text-gold" /> {SITE.email}
            </a>
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-gold mt-0.5 shrink-0" />{" "}
              <span>India · Domestic and international B2B enquiries</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold mb-4">
            Quick Links
          </div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/collection">Products</Link>
            </li>
            <li>
              <Link to="/oem">OEM Manufacturing</Link>
            </li>
            <li>
              <Link to="/customization">Custom Branding</Link>
            </li>
            <li>
              <Link to="/wholesale">Wholesale</Link>
            </li>
            <li>
              <Link to="/industries">Industries</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold mb-4">
            Company
          </div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/founder">Founder</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold mb-4">
            Get Started
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => openCatalogRequest({ category: "Sunglasses", source: "footer" })}
              className="btn-gold w-full justify-center rounded-lg"
            >
              <BookOpen size={15} /> Discuss Your Project
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-luxe py-5 text-xs text-white/75 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>
            © {new Date().getFullYear()} {SITE.name} — All rights reserved.
          </span>
          <span className="text-center">OEM · Private Label · White Label · Wholesale</span>
        </div>
      </div>
    </footer>
  );
}
