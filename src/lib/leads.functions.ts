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
  product_category: z.enum([
    "Watches",
    "Sunglasses",
    "Leather Accessories",
    "Corporate Gifts",
    "Multiple Categories",
  ]),
  quantity: z.number().int().min(1).max(10_000_000).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  page_url: z.string().url().max(2000),
  lead_source: z.string().trim().min(1).max(200),
});

type Inquiry = z.infer<typeof inquirySchema>;

const NOTIFICATION_EMAIL = "rajan@houseofbrands.in";
const NOTIFICATION_WHATSAPP = "917303681194";

function notificationText(data: Inquiry, submittedAt: string) {
  return [
    "New OEM Catalog Request",
    "",
    `Full Name: ${data.name}`,
    `Company Name: ${data.company}`,
    `Email Address: ${data.email}`,
    `WhatsApp Number: ${data.mobile}`,
    `Country: ${data.country}`,
    `Product Category: ${data.product_category}`,
    `Estimated Order Quantity: ${data.quantity ?? "Not provided"}`,
    `Message: ${data.message || "Not provided"}`,
    "",
    `Date & Time: ${submittedAt}`,
    `Page URL: ${data.page_url}`,
    `Lead Source: ${data.lead_source}`,
  ].join("\n");
}

async function sendEmailNotification(data: Inquiry, submittedAt: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return "not_configured" as const;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "OEMSunglasses.com <noreply@houseofbrands.in>",
      to: [NOTIFICATION_EMAIL],
      reply_to: data.email,
      subject: `OEM Catalog Request — ${data.company}`,
      text: notificationText(data, submittedAt),
    }),
  });
  if (!response.ok) throw new Error(`Email notification failed (${response.status})`);
  return "sent" as const;
}

async function sendWhatsAppNotification(data: Inquiry, submittedAt: string) {
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
      text: { preview_url: false, body: notificationText(data, submittedAt) },
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
    const { error } = await sb.from("inquiries").insert({
      name: data.name,
      company: data.company,
      mobile: data.mobile,
      email: data.email,
      country: data.country,
      product_category: data.product_category,
      quantity: data.quantity ?? null,
      message: data.message || null,
      source: data.lead_source,
    });
    if (error) throw new Error(error.message);

    const [emailResult, whatsappResult] = await Promise.allSettled([
      sendEmailNotification(data, submittedAt),
      sendWhatsAppNotification(data, submittedAt),
    ]);
    if (emailResult.status === "rejected") console.error("[OEM Catalog]", emailResult.reason);
    if (whatsappResult.status === "rejected") console.error("[OEM Catalog]", whatsappResult.reason);

    return {
      ok: true,
      submittedAt,
      notifications: {
        email: emailResult.status === "fulfilled" ? emailResult.value : "failed",
        whatsapp: whatsappResult.status === "fulfilled" ? whatsappResult.value : "failed",
      },
    };
  });
