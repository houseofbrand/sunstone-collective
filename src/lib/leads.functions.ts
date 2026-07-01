import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const publicClient = () =>
  createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

const downloadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(150),
  mobile: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(200),
  gst: z.string().trim().max(30).optional().or(z.literal("")),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
});

export const submitDownload = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => downloadSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row, error } = await sb.from("catalogue_downloads").insert({
      name: data.name,
      company: data.company,
      mobile: data.mobile,
      email: data.email,
      gst: data.gst || null,
      country: data.country,
      city: data.city,
    }).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id as string };
  });

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  mobile: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(200),
  gst: z.string().trim().max(30).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  business_type: z.string().trim().max(80).optional().or(z.literal("")),
  product_category: z.string().trim().max(80).optional().or(z.literal("")),
  product_code: z.string().trim().max(50).optional().or(z.literal("")),
  quantity: z.number().int().min(12).max(1_000_000).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().trim().max(50).optional(),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inquirySchema.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { error } = await sb.from("inquiries").insert({
      name: data.name,
      company: data.company || null,
      mobile: data.mobile,
      email: data.email,
      gst: data.gst || null,
      country: data.country || null,
      city: data.city || null,
      business_type: data.business_type || null,
      product_category: data.product_category || null,
      product_code: data.product_code || null,
      quantity: data.quantity ?? null,
      message: data.message || null,
      source: data.source || "inquiry_form",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data } = await sb.from("site_settings").select("whatsapp_number, catalogue_url").eq("id", "default").maybeSingle();
  return {
    whatsapp: data?.whatsapp_number ?? "+917303681194",
    catalogue_url: data?.catalogue_url ?? "",
  };
});
