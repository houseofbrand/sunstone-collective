import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitDownload, getSiteSettings } from "@/lib/leads.functions";
import { X, Download, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function CatalogueDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const submit = useServerFn(submitDownload);
  const settingsFn = useServerFn(getSiteSettings);
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: () => settingsFn({}) });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

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
      setState("done");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  const catalogueUrl = settings?.catalogue_url || "#";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative max-w-lg w-full bg-background border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-ink" aria-label="Close"><X size={20} /></button>
        <div className="p-8 md:p-10">
          {state === "done" ? (
            <div className="text-center py-6">
              <CheckCircle2 className="mx-auto text-gold" size={44} />
              <h3 className="font-display text-2xl mt-4">Thank you</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">Your catalogue is ready to download.</p>
              {catalogueUrl && catalogueUrl !== "#" ? (
                <a href={catalogueUrl} target="_blank" rel="noreferrer" className="btn-gold inline-flex"><Download size={16} /> Download Catalogue PDF</a>
              ) : (
                <p className="text-xs text-muted-foreground">Our team will email the latest catalogue within a few minutes.</p>
              )}
            </div>
          ) : (
            <>
              <div className="eyebrow mb-2">Wholesale Catalogue 2026</div>
              <h3 className="font-display text-2xl leading-tight">Download our latest OEM catalogue</h3>
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
                  <Download size={15} /> {state === "loading" ? "Preparing…" : "Download Catalogue"}
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
