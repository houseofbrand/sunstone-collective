import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitInquiry, getSiteSettings } from "@/lib/leads.functions";
import { X, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { waLink } from "@/lib/site";
import { categories } from "@/lib/products";

export function InquiryDialog({ open, onClose, defaultProductCode, defaultCategory }: { open: boolean; onClose: () => void; defaultProductCode?: string; defaultCategory?: string }) {
  const submit = useServerFn(submitInquiry);
  const settingsFn = useServerFn(getSiteSettings);
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: () => settingsFn({}) });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [waHref, setWaHref] = useState("#");

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    const f = new FormData(e.currentTarget);
    const values = {
      name: String(f.get("name") || ""),
      company: String(f.get("company") || ""),
      mobile: String(f.get("mobile") || ""),
      email: String(f.get("email") || ""),
      gst: String(f.get("gst") || ""),
      country: String(f.get("country") || ""),
      city: String(f.get("city") || ""),
      business_type: String(f.get("business_type") || ""),
      product_category: String(f.get("product_category") || ""),
      product_code: String(f.get("product_code") || ""),
      quantity: Number(f.get("quantity") || 12),
      message: String(f.get("message") || ""),
      source: "inquiry_form",
    };
    try {
      await submit({ data: values });
      const msg = `*New OEM Inquiry — OEMSunglasses.com*%0A%0AName: ${values.name}%0ACompany: ${values.company}%0AMobile: ${values.mobile}%0AEmail: ${values.email}%0ACountry: ${values.country}, ${values.city}%0AGST: ${values.gst || "-"}%0ABusiness: ${values.business_type}%0ACategory: ${values.product_category}%0AProduct Code: ${values.product_code || "-"}%0AQuantity: ${values.quantity}%0A%0AMessage:%0A${values.message}`;
      const num = (settings?.whatsapp || "+917303681194").replace(/[^0-9]/g, "");
      setWaHref(`https://wa.me/${num}?text=${msg}`);
      setState("done");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative max-w-2xl w-full bg-background border border-border shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-ink" aria-label="Close"><X size={20} /></button>
        <div className="p-8 md:p-10">
          {state === "done" ? (
            <div className="text-center py-4">
              <CheckCircle2 className="mx-auto text-gold" size={44} />
              <h3 className="font-display text-2xl mt-4">Inquiry received</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">Our sales team will respond within one working day. For a faster reply, send us this inquiry on WhatsApp.</p>
              <a href={waHref} target="_blank" rel="noreferrer" className="btn-gold inline-flex"><MessageCircle size={16} /> Send on WhatsApp</a>
            </div>
          ) : (
            <>
              <div className="eyebrow mb-2">OEM & Wholesale</div>
              <h3 className="font-display text-2xl leading-tight">Request a quote</h3>
              <div className="rule-gold my-5 w-16" />
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field name="name" label="Full Name" required />
                  <Field name="company" label="Company" />
                  <Field name="mobile" label="Mobile" required />
                  <Field name="email" label="Email" type="email" required />
                  <Field name="country" label="Country" defaultValue="India" />
                  <Field name="city" label="City" />
                  <Field name="gst" label="GST (optional)" />
                  <Select name="business_type" label="Business Type" options={["Distributor","Retailer","Importer","Exporter","D2C Brand","Amazon Seller","Optical Chain","Corporate Buyer","Promotional Agency","Other"]} />
                  <Select name="product_category" label="Product Category" defaultValue={defaultCategory} options={categories.map((c) => c.name)} />
                  <Field name="product_code" label="Product Code" defaultValue={defaultProductCode} />
                  <Field name="quantity" label="Quantity (min 12)" type="number" defaultValue="12" required />
                </div>
                <label className="block">
                  <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Message</span>
                  <textarea name="message" rows={3} className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" placeholder="Tell us about your brand, target lens/colours, packaging, timeline…" />
                </label>
                {state === "error" && <p className="text-xs text-destructive">{errMsg}</p>}
                <button disabled={state === "loading"} className="btn-gold w-full mt-2 disabled:opacity-60">
                  <Send size={15} /> {state === "loading" ? "Sending…" : "Submit Inquiry"}
                </button>
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
      <input name={name} type={type} required={required} defaultValue={defaultValue} min={type === "number" ? 12 : undefined} className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
    </label>
  );
}
function Select({ label, name, options, defaultValue }: { label: string; name: string; options: string[]; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      <select name={name} defaultValue={defaultValue} className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

// Also default-export a top-level trigger context via simple hook
