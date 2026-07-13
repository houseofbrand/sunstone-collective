import { createContext, useContext, useState, type ReactNode } from "react";
import { InquiryDialog } from "./InquiryDialog";

type Ctx = {
  openCatalogRequest: (opts?: { category?: string; source?: string }) => void;
};
const DialogCtx = createContext<Ctx | null>(null);

export const useDialogs = () => {
  const c = useContext(DialogCtx);
  if (!c) throw new Error("useDialogs must be used inside DialogsProvider");
  return c;
};

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<{ open: boolean; category?: string; source?: string }>({
    open: false,
  });

  return (
    <DialogCtx.Provider
      value={{
        openCatalogRequest: (opts) =>
          setRequest({ open: true, category: opts?.category, source: opts?.source }),
      }}
    >
      {children}
      <InquiryDialog
        open={request.open}
        onClose={() => setRequest({ open: false })}
        defaultCategory={request.category}
        leadSource={request.source}
      />
    </DialogCtx.Provider>
  );
}
