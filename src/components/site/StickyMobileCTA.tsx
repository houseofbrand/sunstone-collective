import { BookOpen } from "lucide-react";
import { useDialogs } from "./DialogsProvider";

export function StickyMobileCTA() {
  const { openCatalogRequest } = useDialogs();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-[#081A32]/95 p-3 shadow-[0_-12px_35px_rgba(3,12,25,0.22)] backdrop-blur-md md:hidden">
      <button
        data-testid="sticky-mobile-catalog-request"
        onClick={() => openCatalogRequest({ category: "Sunglasses", source: "sticky_mobile_cta" })}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#D5A34A] px-5 py-3.5 text-sm font-bold text-[#081A32] transition active:scale-[0.99]"
      >
        <BookOpen size={17} /> Request OEM Catalog
      </button>
    </div>
  );
}
