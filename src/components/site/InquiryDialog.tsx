import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Send, ShieldCheck, X } from "lucide-react";
import { submitInquiry } from "@/lib/leads.functions";

const PRODUCT_CATEGORIES = [
  "Watches",
  "Sunglasses",
  "Leather Accessories",
  "Corporate Gifts",
  "Multiple Categories",
] as const;

type DialogState = "idle" | "loading" | "done" | "error";

const WHATSAPP_RECIPIENT = "917303681194";

function createWhatsAppMessage(
  data: {
    name: string;
    company: string;
    email: string;
    mobile: string;
    country: string;
    product_category: string;
    quantity?: number;
    message: string;
    page_url: string;
    lead_source: string;
  },
  submittedAt: string,
) {
  return [
    "*New OEM Catalog Request*",
    "",
    "*Contact Details*",
    `Full Name: ${data.name}`,
    `Company Name: ${data.company}`,
    `Email Address: ${data.email}`,
    `WhatsApp Number: ${data.mobile}`,
    `Country: ${data.country}`,
    "",
    "*Requirement Details*",
    `Product Category: ${data.product_category}`,
    `Estimated Order Quantity: ${data.quantity ?? "Not provided"}`,
    `Message: ${data.message || "Not provided"}`,
    "",
    "*Inquiry Details*",
    `Date & Time: ${new Date(submittedAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    })} IST`,
    `Page URL: ${data.page_url}`,
    `Lead Source: ${data.lead_source}`,
  ].join("\n");
}

export function InquiryDialog({
  open,
  onClose,
  defaultCategory = "Sunglasses",
  leadSource,
}: {
  open: boolean;
  onClose: () => void;
  defaultCategory?: string;
  leadSource?: string;
}) {
  const submit = useServerFn(submitInquiry);
  const [state, setState] = useState<DialogState>("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!open) return;
    setState("idle");
    setErrMsg("");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setErrMsg("");

    const form = new FormData(event.currentTarget);
    const quantityValue = String(form.get("estimated_order_quantity") || "").trim();
    const params = new URLSearchParams(window.location.search);
    const trackedSource = params.get("utm_source")
      ? `utm:${params.get("utm_source")}${params.get("utm_campaign") ? `/${params.get("utm_campaign")}` : ""}`
      : leadSource ||
        (document.referrer ? `referral:${new URL(document.referrer).hostname}` : "direct");

    const inquiry = {
      name: String(form.get("full_name") || ""),
      company: String(form.get("company_name") || ""),
      email: String(form.get("email") || ""),
      mobile: String(form.get("whatsapp_number") || ""),
      country: String(form.get("country") || ""),
      product_category: String(form.get("product_category") || ""),
      quantity: quantityValue ? Number(quantityValue) : undefined,
      message: String(form.get("message") || ""),
      page_url: window.location.href,
      lead_source: trackedSource,
    };

    // Open during the submit gesture so browsers do not block the WhatsApp tab after the request.
    const whatsappWindow = window.open("about:blank", "oem-catalog-whatsapp");

    try {
      const result = await submit({ data: inquiry });
      const whatsappMessage = createWhatsAppMessage(inquiry, result.submittedAt);
      const whatsappUrl = `https://wa.me/${WHATSAPP_RECIPIENT}?text=${encodeURIComponent(whatsappMessage)}`;

      setState("done");
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.opener = null;
        whatsappWindow.location.replace(whatsappUrl);
      } else {
        window.location.assign(whatsappUrl);
      }
    } catch (error) {
      whatsappWindow?.close();
      setErrMsg(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setState("error");
    }
  };

  const selectedCategory = PRODUCT_CATEGORIES.includes(
    defaultCategory as (typeof PRODUCT_CATEGORIES)[number],
  )
    ? defaultCategory
    : "Sunglasses";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#061426]/80 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-request-title"
        className="relative my-auto max-h-[calc(100vh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-background shadow-[0_30px_90px_rgba(3,12,25,0.45)] sm:max-h-[calc(100vh-3rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-gold hover:text-foreground"
          aria-label="Close request form"
        >
          <X size={19} />
        </button>

        <div className="border-b border-border bg-[#081A32] px-6 py-7 pr-16 text-white sm:px-9 sm:py-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D5A34A]">
            OEM &amp; Private Label
          </div>
          <h2
            id="catalog-request-title"
            className="mt-2 font-display text-3xl leading-tight sm:text-4xl"
          >
            Request OEM Catalog
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
            Looking for OEM or Private Label Manufacturing? Please share your details below, and our
            team will contact you with the most suitable OEM catalog, product recommendations,
            customization options, MOQ, and quotation.
          </p>
        </div>

        <div className="px-6 py-7 sm:px-9 sm:py-8">
          {state === "done" ? (
            <div className="py-8 text-center sm:py-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#D5A34A]/15 text-[#B78022]">
                <CheckCircle2 size={34} />
              </div>
              <h3 className="mt-5 font-display text-2xl text-foreground">Request received</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Thank you for your inquiry! Our team will review your requirements and get in touch
                shortly with the appropriate OEM catalog and quotation.
              </p>
              <button onClick={onClose} className="btn-ink mt-7 inline-flex">
                Close
              </button>
            </div>
          ) : (
            <form data-testid="catalog-request-form" onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="full_name" label="Full Name" autoComplete="name" required />
                <Field
                  name="company_name"
                  label="Company Name"
                  autoComplete="organization"
                  required
                />
                <Field
                  name="email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  required
                />
                <Field
                  name="whatsapp_number"
                  label="WhatsApp Number"
                  type="tel"
                  autoComplete="tel"
                  required
                />
                <Field name="country" label="Country" autoComplete="country-name" required />
                <Select
                  name="product_category"
                  label="Product Category"
                  defaultValue={selectedCategory}
                  options={[...PRODUCT_CATEGORIES]}
                  required
                />
                <Field
                  name="estimated_order_quantity"
                  label="Estimated Order Quantity (Optional)"
                  type="number"
                  min="1"
                  inputMode="numeric"
                />
              </div>

              <label className="block" htmlFor="catalog-message">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Message (Optional)
                </span>
                <textarea
                  id="catalog-message"
                  name="message"
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
                  placeholder="Tell us about your product requirements, customization, target pricing, or timeline."
                />
              </label>

              {state === "error" && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  {errMsg}
                </p>
              )}

              <button
                disabled={state === "loading"}
                className="btn-gold w-full justify-center rounded-lg py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />{" "}
                {state === "loading" ? "Sending request…" : "Request OEM Catalog"}
              </button>
              <p className="flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground">
                <ShieldCheck size={13} className="text-gold" /> Your details are shared only with
                our OEM team.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  min,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  min?: string;
  inputMode?: "numeric";
}) {
  const id = `catalog-${name}`;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
        {required && " *"}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        min={min}
        inputMode={inputMode}
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
  required?: boolean;
}) {
  const id = `catalog-${name}`;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
        {required && " *"}
      </span>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15"
      >
        <option value="" disabled>
          Select a category
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
