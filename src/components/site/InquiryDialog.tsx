import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ImagePlus, Send, ShieldCheck, X } from "lucide-react";
import { submitInquiry } from "@/lib/leads.functions";

type DialogState = "idle" | "loading" | "done" | "error";

const WHATSAPP_RECIPIENT = "917303681194";
const MAX_REFERENCE_SIZE = 5 * 1024 * 1024;

type InquiryPayload = {
  name: string;
  company: string;
  email: string;
  mobile: string;
  country: string;
  product_requirement: string;
  quantity?: number;
  business_type: "Private Label" | "Custom OEM / ODM" | "Not Sure";
  target_price: string;
  branding_requirements: string;
  packaging_requirements: string;
  additional_requirements: string;
  reference_file?: {
    name: string;
    content_type: "image/jpeg" | "image/png" | "image/webp";
    base64: string;
  };
  page_url: string;
  lead_source: string;
};

function createWhatsAppMessage(data: InquiryPayload, submittedAt: string, referenceUrl?: string) {
  return [
    "*New OEM Project Enquiry*",
    "",
    "*Contact Details*",
    `Name: ${data.name}`,
    `Company / Brand: ${data.company}`,
    `Country: ${data.country}`,
    `Email: ${data.email}`,
    `WhatsApp / Phone: ${data.mobile}`,
    "",
    "*Project Brief*",
    `Product Requirement: ${data.product_requirement}`,
    `Estimated Quantity: ${data.quantity ?? "Not provided"}`,
    `Programme: ${data.business_type}`,
    `Target Price: ${data.target_price || "Not provided"}`,
    `Branding Requirements: ${data.branding_requirements || "Not provided"}`,
    `Packaging Requirements: ${data.packaging_requirements || "Not provided"}`,
    `Reference Image: ${referenceUrl || data.reference_file?.name || "Not provided"}`,
    `Additional Requirements: ${data.additional_requirements || "Not provided"}`,
    "",
    "*Enquiry Details*",
    `Date & Time: ${new Date(submittedAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    })} IST`,
    `Page URL: ${data.page_url}`,
    `Lead Source: ${data.lead_source}`,
  ].join("\n");
}

async function readReferenceFile(file: File) {
  if (file.size > MAX_REFERENCE_SIZE) {
    throw new Error("Reference image must be 5 MB or smaller.");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Please upload a JPG, PNG or WebP reference image.");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Reference image could not be read."));
    reader.readAsDataURL(file);
  });

  return {
    name: file.name,
    content_type: file.type as "image/jpeg" | "image/png" | "image/webp",
    base64: dataUrl.split(",")[1] || "",
  };
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
    const quantityValue = String(form.get("estimated_quantity") || "").trim();
    const params = new URLSearchParams(window.location.search);
    const trackedSource = params.get("utm_source")
      ? `utm:${params.get("utm_source")}${
          params.get("utm_campaign") ? `/${params.get("utm_campaign")}` : ""
        }`
      : leadSource ||
        (document.referrer ? `referral:${new URL(document.referrer).hostname}` : "direct");
    const whatsappWindow = window.open("about:blank", "oem-enquiry-whatsapp");

    try {
      const fileEntry = form.get("reference_image");
      const referenceFile =
        fileEntry instanceof File && fileEntry.size > 0
          ? await readReferenceFile(fileEntry)
          : undefined;

      const inquiry: InquiryPayload = {
        name: String(form.get("name") || ""),
        company: String(form.get("company") || ""),
        country: String(form.get("country") || ""),
        email: String(form.get("email") || ""),
        mobile: String(form.get("mobile") || ""),
        product_requirement: String(form.get("product_requirement") || ""),
        quantity: quantityValue ? Number(quantityValue) : undefined,
        business_type: String(form.get("business_type") || "Not Sure") as
          "Private Label" | "Custom OEM / ODM" | "Not Sure",
        target_price: String(form.get("target_price") || ""),
        branding_requirements: String(form.get("branding_requirements") || ""),
        packaging_requirements: String(form.get("packaging_requirements") || ""),
        additional_requirements: String(form.get("additional_requirements") || ""),
        reference_file: referenceFile,
        page_url: window.location.href,
        lead_source: trackedSource,
      };

      const result = await submit({ data: inquiry });
      const whatsappMessage = createWhatsAppMessage(
        inquiry,
        result.submittedAt,
        result.referenceUrl,
      );
      const whatsappUrl = `https://wa.me/${WHATSAPP_RECIPIENT}?text=${encodeURIComponent(
        whatsappMessage,
      )}`;

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

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#061426]/85 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="oem-enquiry-title"
        className="relative my-auto max-h-[calc(100vh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/15 bg-background shadow-[0_30px_90px_rgba(3,12,25,0.55)] sm:max-h-[calc(100vh-3rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#081A32] text-white/75 transition hover:border-primary hover:text-white"
          aria-label="Close enquiry form"
        >
          <X size={19} />
        </button>

        <div className="border-b border-white/10 bg-[#081A32] px-6 py-7 pr-16 text-white sm:px-9 sm:py-8">
          <div className="eyebrow">OEM &amp; Private Label</div>
          <h2 id="oem-enquiry-title" className="mt-2 font-display text-3xl sm:text-4xl">
            Discuss Your Eyewear Project
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
            Share your product, quantity, branding and packaging requirements. Our team will review
            the brief and respond with the most relevant development route, MOQ and quotation.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
            MOQ: 120 pcs · Mix up to 10 models · Minimum 12 pcs per model/colour
          </p>
        </div>

        <div className="px-6 py-7 sm:px-9 sm:py-8">
          {state === "done" ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
                <CheckCircle2 size={34} />
              </div>
              <h3 className="mt-5 font-display text-2xl">Enquiry received</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm">
                Thank you. Our team will review your requirements and respond with the appropriate
                next steps for your OEM or private-label project.
              </p>
              <button onClick={onClose} className="btn-ink mt-7">
                Close
              </button>
            </div>
          ) : (
            <form data-testid="oem-enquiry-form" onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Name" autoComplete="name" required />
                <Field
                  name="company"
                  label="Company / Brand Name"
                  autoComplete="organization"
                  required
                />
                <Field name="country" label="Country" autoComplete="country-name" required />
                <Field name="email" label="Email" type="email" autoComplete="email" required />
                <Field
                  name="mobile"
                  label="WhatsApp / Phone"
                  type="tel"
                  autoComplete="tel"
                  required
                />
                <Select
                  name="business_type"
                  label="Private Label / Custom OEM"
                  options={["Private Label", "Custom OEM / ODM", "Not Sure"]}
                  required
                />
                <Field
                  name="product_requirement"
                  label="Product Requirement"
                  defaultValue={defaultCategory}
                  placeholder="e.g. acetate sunglasses, sports frames"
                  required
                />
                <Field
                  name="estimated_quantity"
                  label="Estimated Quantity"
                  type="number"
                  min="120"
                  inputMode="numeric"
                  placeholder="Minimum total: 120"
                  required
                />
                <Field
                  name="target_price"
                  label="Target Price (Optional)"
                  placeholder="Include currency and basis"
                />
                <label className="block" htmlFor="oem-reference-image">
                  <span className="field-label">Upload Design / Reference Image (Optional)</span>
                  <span className="flex min-h-12 items-center gap-3 rounded-lg border border-input bg-secondary px-3.5 py-2.5 text-sm text-white/70">
                    <ImagePlus size={18} className="text-primary" />
                    <input
                      id="oem-reference-image"
                      name="reference_image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="w-full border-0 bg-transparent p-0 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:font-semibold file:text-white"
                    />
                  </span>
                  <span className="mt-1 block text-[10px] text-white/50">
                    JPG, PNG or WebP · Max 5 MB
                  </span>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextArea
                  name="branding_requirements"
                  label="Branding Requirements"
                  placeholder="Logo position, colours, lens or temple branding..."
                  required
                />
                <TextArea
                  name="packaging_requirements"
                  label="Packaging Requirements"
                  placeholder="Case, pouch, cleaning cloth, retail box, inserts..."
                  required
                />
              </div>

              <TextArea
                name="additional_requirements"
                label="Additional Requirements (Optional)"
                placeholder="Target market, timeline, references or any other project details."
                rows={3}
              />

              {state === "error" && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-white"
                >
                  {errMsg}
                </p>
              )}

              <button
                disabled={state === "loading"}
                className="btn-gold w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {state === "loading" ? "Submitting enquiry…" : "Submit OEM Enquiry"}
              </button>
              <p className="flex items-center justify-center gap-2 text-center text-[11px] text-white/55">
                <ShieldCheck size={13} className="text-primary" />
                Your project information is shared only with our OEM team.
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
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  min?: string;
  inputMode?: "numeric";
  placeholder?: string;
  defaultValue?: string;
}) {
  const id = `oem-${name}`;
  return (
    <label className="block" htmlFor={id}>
      <span className="field-label">
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
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-input bg-secondary px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  const id = `oem-${name}`;
  return (
    <label className="block" htmlFor={id}>
      <span className="field-label">
        {label}
        {required && " *"}
      </span>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-lg border border-input bg-secondary px-3.5 py-2.5 text-sm outline-none"
      >
        <option value="" disabled>
          Select programme
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

function TextArea({
  label,
  name,
  placeholder,
  required,
  rows = 4,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const id = `oem-${name}`;
  return (
    <label className="block" htmlFor={id}>
      <span className="field-label">
        {label}
        {required && " *"}
      </span>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-secondary px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}
