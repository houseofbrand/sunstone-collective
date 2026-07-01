import { MessageCircle } from "lucide-react";
import { SITE, waLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink(`Hello ${SITE.name}, I'm interested in OEM sunglasses. Please share catalogue & pricing.`)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl hover:scale-105 transition"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
