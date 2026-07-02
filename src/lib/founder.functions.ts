import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type Achievement = { value: string; label: string };
export type FounderProfile = {
  name: string;
  designation: string;
  bio: string;
  quote: string;
  image_url: string;
  website_url: string;
  linkedin_url: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  achievements: Achievement[];
};

const publicClient = () =>
  createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

const DEFAULT: FounderProfile = {
  name: "Rajan Mehta",
  designation: "Founder & CEO",
  bio: "",
  quote: "",
  image_url: "/founder/rajan.jpg",
  website_url: "https://www.rajanmehta.in",
  linkedin_url: "",
  instagram_url: "",
  facebook_url: "",
  youtube_url: "",
  achievements: [],
};

export const getFounder = createServerFn({ method: "GET" }).handler(async (): Promise<FounderProfile> => {
  const sb = publicClient();
  const { data } = await sb.from("founder_profile").select("*").eq("id", "default").maybeSingle();
  if (!data) return DEFAULT;
  return {
    name: data.name,
    designation: data.designation,
    bio: data.bio,
    quote: data.quote,
    image_url: data.image_url,
    website_url: data.website_url,
    linkedin_url: data.linkedin_url,
    instagram_url: data.instagram_url,
    facebook_url: data.facebook_url,
    youtube_url: data.youtube_url,
    achievements: (data.achievements as Achievement[]) ?? [],
  };
});

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  designation: z.string().trim().min(1).max(120),
  bio: z.string().trim().max(5000),
  quote: z.string().trim().max(1000),
  image_url: z.string().trim().min(1).max(500),
  website_url: z.string().trim().max(300),
  linkedin_url: z.string().trim().max(300),
  instagram_url: z.string().trim().max(300),
  facebook_url: z.string().trim().max(300),
  youtube_url: z.string().trim().max(300),
  achievements: z.array(z.object({ value: z.string().max(20), label: z.string().max(120) })).max(12),
});

export const adminUpdateFounder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("founder_profile").upsert({ id: "default", ...data });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const uploadSchema = z.object({
  base64: z.string().min(10),
  content_type: z.string().max(100),
  ext: z.string().max(10),
});

export const adminUploadFounderImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => uploadSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const path = `founder/rajan-${Date.now()}.${data.ext.replace(/[^a-z0-9]/gi, "") || "jpg"}`;
    const up = await supabaseAdmin.storage.from("product-images").upload(path, bytes, {
      contentType: data.content_type,
      upsert: true,
    });
    if (up.error) throw new Error(up.error.message);
    const { data: signed, error: sErr } = await supabaseAdmin.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (sErr) throw new Error(sErr.message);
    return { url: signed.signedUrl };
  });
