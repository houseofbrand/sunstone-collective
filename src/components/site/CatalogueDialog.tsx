import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitDownload } from "@/lib/leads.functions";
import { listPublicCatalogues, requestCatalogueDownload } from "@/lib/catalogues.functions";
import { X, Download, CheckCircle2, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type PublicCat = { id: string; slug: string; title: string; description: string | null; file_size: number | null; sort_order: number };

export function CatalogueDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const submit = useServerFn(submitDownload);
  const catsFn = useServerFn(listPublicCatalogues);
  const requestFn = useServerFn(requestCatalogueDownload);

  const { data: catalogues } = useQuery<PublicCat[]>({
    queryKey: ["public-catalogues"],
    queryFn: () => catsFn({}) as any,
    enabled: open,
  });

  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [leadId, setLeadId] = useState<string | undefined>(undefined);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    const f = new FormData(e.currentTarget);
    try {
      await submit({
        data: {
          name: String(f.get("name") || ""),
          company: String(f.get("company") || ""),
          mobile: String(f.get("mobile") || ""),
          email: String(f.get("email") || ""),
          gst: String(f.get("gst") || ""),
          country: String(f.get("country") || ""),
          city: String(f.get("city") || ""),
        },
      });
      // Best-effort: find the row we just inserted to reference it in download events
      const { data } = await supabase
        .from("catalogue_downloads")
        .select("id")
        .eq("email", String(f.get("email") || ""))
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setLeadId(data?.id);
      setState("done");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  const handleDownload = async (cat: PublicCat) => {
    setDownloadingId(cat.id);
    try {
      const res = await requestFn({
        data: {
          catalogue_id: cat.id,
          lead_id: leadId,
          user_agent: navigator.userAgent.slice(0, 400),
          referrer: document.referrer.slice(0, 400),
        },
      });
      window.open(res.url, "_blank", "noopener");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not start download");
    } finally {
      setDownloadingId(null);
    }
  };

  const fmt = (n?: number | null) => (n ? `${(n / 1024 / 1024).toFixed(1)} MB` : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative max-w-lg w-full bg-background border border-border shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-ink z-10" aria-label="Close"><X size={20} /></button>
        <div className="p-8 md:p-10">
          {state === "done" ? (
            <div>
              <div className="text-center">
                <CheckCircle2 className="mx-auto text-gold" size={44} />
                <h3 className="font-display text-2xl mt-4">Thank you</h3>
                <p className="text-sm text-muted-foreground mt-2">Choose a catalogue below to download.</p>
              </div>
              <div className="mt-6 space-y-2">
                {(catalogues ?? []).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleDownload(c)}
                    disabled={downloadingId === c.id}
                    className="w-full flex items-center gap-3 border border-border hover:border-gold p-3 text-left transition-colors disabled:opacity-60"
                  >
                    <FileText size={20} className="text-gold flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base text-ink">{c.title}</div>
                      {c.description && <div className="text-xs text-muted-foreground truncate">{c.description}</div>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[11px] text-muted-foreground">{fmt(c.file_size)}</div>
                      <div className="text-xs text-gold flex items-center gap-1 mt-0.5">
                        <Download size={12} /> {downloadingId === c.id ? "…" : "PDF"}
                      </div>
                    </div>
                  </button>
                ))}
                {(!catalogues || catalogues.length === 0) && (
                  <p className="text-xs text-muted-foreground text-center py-4">Our team will email the catalogue shortly.</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="eyebrow mb-2">Wholesale Catalogues 2026</div>
              <h3 className="font-display text-2xl leading-tight">Download our latest OEM catalogues</h3>
              <div className="rule-gold my-5 w-16" />
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field name="name" label="Full Name" required />
                  <Field name="company" label="Company" required />
                  <Field name="mobile" label="Mobile" required />
                  <Field name="email" label="Email" type="email" required />
                  <Field name="country" label="Country" required defaultValue="India" />
                  <Field name="city" label="City" required />
                </div>
                <Field name="gst" label="GST Number (optional)" />
                {state === "error" && <p className="text-xs text-destructive">{errMsg}</p>}
                <button disabled={state === "loading"} className="btn-gold w-full mt-2 disabled:opacity-60">
                  <Download size={15} /> {state === "loading" ? "Preparing…" : "Access Catalogues"}
                </button>
                <p className="text-[11px] text-muted-foreground text-center pt-1">Your details are used only to send you our latest B2B pricing & catalogue.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required, defaultValue }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{label}{required && " *"}</span>
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
    </label>
  );
}
