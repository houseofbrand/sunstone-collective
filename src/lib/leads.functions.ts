import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const publicClient = () =>
  createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(150),
  mobile: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(200),
  country: z.string().trim().min(2).max(80),
  product_requirement: z.string().trim().min(2).max(500),
  quantity: z.number().int().min(12).max(10_000_000).optional(),
  business_type: z.enum(["Private Label", "Custom OEM / ODM", "Not Sure"]),
  target_price: z.string().trim().max(200).optional().or(z.literal("")),
  branding_requirements: z.string().trim().max(1000).optional().or(z.literal("")),
  packaging_requirements: z.string().trim().max(1000).optional().or(z.literal("")),
  additional_requirements: z.string().trim().max(2000).optional().or(z.literal("")),
  reference_file: z
    .object({
      name: z.string().trim().min(1).max(200),
      content_type: z.enum(["image/jpeg", "image/png", "image/webp"]),
      base64: z.string().min(10).max(7_500_000),
    })
    .optional(),
  page_url: z.string().url().max(2000),
  lead_source: z.string().trim().min(1).max(200),
});

type Inquiry = z.infer<typeof inquirySchema>;

const NOTIFICATION_EMAIL = "rajan@houseofbrands.in";
const NOTIFICATION_WHATSAPP = "917303681194";

function notificationText(data: Inquiry, submittedAt: string, referenceUrl?: string) {
  return [
    "New OEM Project Enquiry",
    "",
    `Full Name: ${data.name}`,
    `Company Name: ${data.company}`,
    `Email Address: ${data.email}`,
    `WhatsApp Number: ${data.mobile}`,
    `Country: ${data.country}`,
    `Product Requirement: ${data.product_requirement}`,
    `Estimated Order Quantity: ${data.quantity ?? "Not provided"}`,
    `Business Type: ${data.business_type}`,
    `Target Price: ${data.target_price || "Not provided"}`,
    `Branding Requirements: ${data.branding_requirements || "Not provided"}`,
    `Packaging Requirements: ${data.packaging_requirements || "Not provided"}`,
    `Reference Image: ${referenceUrl || data.reference_file?.name || "Not provided"}`,
    `Additional Requirements: ${data.additional_requirements || "Not provided"}`,
    "",
    `Date & Time: ${submittedAt}`,
    `Page URL: ${data.page_url}`,
    `Lead Source: ${data.lead_source}`,
  ].join("\n");
}

async function sendEmailNotification(data: Inquiry, submittedAt: string, referenceUrl?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return "not_configured" as const;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "SunglassManufacturer.com <noreply@houseofbrands.in>",
      to: [NOTIFICATION_EMAIL],
      reply_to: data.email,
      subject: `OEM Project Enquiry — ${data.company}`,
      text: notificationText(data, submittedAt, referenceUrl),
    }),
  });
  if (!response.ok) throw new Error(`Email notification failed (${response.status})`);
  return "sent" as const;
}

async function sendWhatsAppNotification(data: Inquiry, submittedAt: string, referenceUrl?: string) {
  const accessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId) return "not_configured" as const;

  const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION || "v23.0";
  const endpoint =
    process.env.WHATSAPP_CLOUD_API_URL ||
    `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: process.env.WHATSAPP_NOTIFICATION_TO || NOTIFICATION_WHATSAPP,
      type: "text",
      text: { preview_url: false, body: notificationText(data, submittedAt, referenceUrl) },
    }),
  });
  if (!response.ok) throw new Error(`WhatsApp notification failed (${response.status})`);
  return "sent" as const;
}

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inquirySchema.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const submittedAt = new Date().toISOString();
    let referenceUrl: string | undefined;

    if (data.reference_file) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const extensionByType = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      } as const;
      const safeName = data.reference_file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
      const storagePath = `inquiry-references/${crypto.randomUUID()}-${safeName || "reference"}.${
        extensionByType[data.reference_file.content_type]
      }`;
      const bytes = Uint8Array.from(atob(data.reference_file.base64), (char) => char.charCodeAt(0));
      const upload = await supabaseAdmin.storage.from("product-images").upload(storagePath, bytes, {
        contentType: data.reference_file.content_type,
        upsert: false,
      });
      if (upload.error) throw new Error("Reference image upload failed. Please try again.");
      const signed = await supabaseAdmin.storage
        .from("product-images")
        .createSignedUrl(storagePath, 60 * 60 * 24 * 30);
      if (signed.error) throw new Error("Reference image link could not be created.");
      referenceUrl = signed.data.signedUrl;
    }

    const savedMessage = [
      `Target Price: ${data.target_price || "Not provided"}`,
      `Branding: ${data.branding_requirements || "Not provided"}`,
      `Packaging: ${data.packaging_requirements || "Not provided"}`,
      `Reference Image: ${referenceUrl || "Not provided"}`,
      `Additional: ${data.additional_requirements || "Not provided"}`,
    ].join("\n");
    const { error } = await sb.from("inquiries").insert({
      name: data.name,
      company: data.company,
      mobile: data.mobile,
      email: data.email,
      country: data.country,
      product_category: data.product_requirement,
      quantity: data.quantity ?? null,
      business_type: data.business_type,
      message: savedMessage,
      source: data.lead_source,
    });
    if (error) throw new Error(error.message);

    const [emailResult, whatsappResult] = await Promise.allSettled([
      sendEmailNotification(data, submittedAt, referenceUrl),
      sendWhatsAppNotification(data, submittedAt, referenceUrl),
    ]);
    if (emailResult.status === "rejected") console.error("[OEM Enquiry]", emailResult.reason);
    if (whatsappResult.status === "rejected") console.error("[OEM Enquiry]", whatsappResult.reason);

    return {
      ok: true,
      submittedAt,
      referenceUrl,
      notifications: {
        email: emailResult.status === "fulfilled" ? emailResult.value : "failed",
        whatsapp: whatsappResult.status === "fulfilled" ? whatsappResult.value : "failed",
      },
    };
  });
