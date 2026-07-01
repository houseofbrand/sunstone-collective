import { createContext, useContext, useState, type ReactNode } from "react";
import { CatalogueDialog } from "./CatalogueDialog";
import { InquiryDialog } from "./InquiryDialog";

type Ctx = {
  openCatalogue: () => void;
  openInquiry: (opts?: { productCode?: string; category?: string }) => void;
};
const DialogCtx = createContext<Ctx | null>(null);

export const useDialogs = () => {
  const c = useContext(DialogCtx);
  if (!c) throw new Error("useDialogs must be used inside DialogsProvider");
  return c;
};

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [cat, setCat] = useState(false);
  const [inq, setInq] = useState<{ open: boolean; productCode?: string; category?: string }>({ open: false });

  return (
    <DialogCtx.Provider
      value={{
        openCatalogue: () => setCat(true),
        openInquiry: (opts) => setInq({ open: true, productCode: opts?.productCode, category: opts?.category }),
      }}
    >
      {children}
      <CatalogueDialog open={cat} onClose={() => setCat(false)} />
      <InquiryDialog open={inq.open} onClose={() => setInq({ open: false })} defaultProductCode={inq.productCode} defaultCategory={inq.category} />
    </DialogCtx.Provider>
  );
}
