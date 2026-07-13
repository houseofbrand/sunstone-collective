import { Mail, MessageCircle } from "lucide-react";
import { SITE, waLink } from "@/lib/site";

export function ContactWidget() {
  return (
    <div
      className="fixed bottom-24 right-4 z-40 flex flex-col gap-2.5 md:bottom-6 md:right-6"
      aria-label="Contact options"
    >
      <a
        href={`mailto:${SITE.email}`}
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#081A32] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#102D52]"
        aria-label={`Email ${SITE.email}`}
        title={SITE.email}
      >
        <Mail size={20} />
      </a>
      <a
        href={waLink(`Hello ${SITE.name}, I'd like to discuss OEM or private label manufacturing.`)}
        target="_blank"
        rel="noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[#071D12] shadow-xl transition hover:-translate-y-0.5 hover:brightness-95"
        aria-label={`Chat on WhatsApp at ${SITE.whatsapp}`}
        title={SITE.whatsapp}
      >
        <MessageCircle size={22} />
      </a>
    </div>
  );
}
