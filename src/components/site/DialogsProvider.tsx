import { createContext, useContext, useState, type ReactNode } from "react";
import { CatalogueDialog } from "./CatalogueDialog";
import { InquiryDialog } from "./InquiryDialog";

type Ctx = {
  openCatalogue: (categorySlug?: string) => void;
  openInquiry: (opts?: { productCode?: string; category?: string }) => void;
};
const DialogCtx = createContext<Ctx | null>(null);

export const useDialogs = () => {
  const c = useContext(DialogCtx);
  if (!c) throw new Error("useDialogs must be used inside DialogsProvider");
  return c;
};

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [cat, setCat] = useState<{ open: boolean; categorySlug?: string }>({ open: false });
  const [inq, setInq] = useState<{ open: boolean; productCode?: string; category?: string }>({ open: false });

  return (
    <DialogCtx.Provider
      value={{
        openCatalogue: (categorySlug) => setCat({ open: true, categorySlug }),
        openInquiry: (opts) => setInq({ open: true, productCode: opts?.productCode, category: opts?.category }),
      }}
    >
      {children}
      <CatalogueDialog open={cat.open} onClose={() => setCat({ open: false })} categorySlug={cat.categorySlug} />
      <InquiryDialog open={inq.open} onClose={() => setInq({ open: false })} defaultProductCode={inq.productCode} defaultCategory={inq.category} />
    </DialogCtx.Provider>
  );
}
