import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDialogs } from "./DialogsProvider";
import logoAsset from "@/assets/oem-sunglasses-logo-transparent.png.asset.json";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-300 ease-out ${
        scrolled ? "shadow-[0_6px_20px_-8px_rgba(0,0,0,0.55)]" : "shadow-none"
      }`}
      style={{ backgroundColor: "#081A32", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: "1400px", height: "80px", paddingLeft: "36px", paddingRight: "36px" }}
      >
        <Link to="/" className="flex items-center shrink-0" aria-label="OEMSunglasses.com home">
          <img
            src={logoAsset.url}
            alt="OEMSunglasses.com"
            className="w-auto h-auto"
            style={{ height: "44px", width: "auto" }}
          />
        </Link>

        <nav className="hidden xl:flex items-center" style={{ gap: "28px" }}>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="nav-link text-white/90 hover:text-white transition-colors duration-300 ease-out"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.3px",
                lineHeight: 1.2,
              }}
              activeProps={{ className: "nav-link nav-link-active text-white" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center shrink-0" style={{ gap: "16px" }}>
          <button
            onClick={() => openCatalogue()}
            className="bg-transparent text-white hover:bg-white hover:text-[#081A32] transition-all duration-300 ease-out"
            style={{ height: "46px", padding: "0 28px", fontSize: "15px", fontWeight: 600, border: "1.5px solid #FFFFFF", borderRadius: "8px" }}
          >
            Download Catalogue
          </button>
          <button
            onClick={() => openInquiry()}
            className="bg-white text-[#081A32] hover:bg-[#EAF0FB] transition-all duration-300 ease-out"
            style={{ height: "46px", padding: "0 30px", fontSize: "15px", fontWeight: 700, borderRadius: "8px" }}
          >
            Get Quote
          </button>
        </div>

        <button
          className="xl:hidden p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t border-white/10" style={{ backgroundColor: "#081A32" }}>
          <div className="mx-auto px-6 py-5 flex flex-col gap-1" style={{ maxWidth: "1400px" }}>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 px-2 rounded-md text-white hover:text-[#4C84F5] hover:bg-white/5 transition-colors"
                style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "0.3px" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-white/10">
              <button
                onClick={() => { setOpen(false); openCatalogue(); }}
                className="border-[1.5px] border-white text-white bg-transparent"
                style={{ height: "46px", fontSize: "15px", fontWeight: 600, borderRadius: "8px" }}
              >
                Download Catalogue
              </button>
              <button
                onClick={() => { setOpen(false); openInquiry(); }}
                className="bg-white text-[#081A32]"
                style={{ height: "46px", fontSize: "15px", fontWeight: 700, borderRadius: "8px" }}
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
