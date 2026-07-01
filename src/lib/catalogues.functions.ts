import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const publicClient = () =>
  createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

/** Public: list active catalogues (no signed URLs). */
export const listPublicCatalogues = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("catalogues")
    .select("id, slug, title, description, file_size, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

/** Public: after form submit, request a short-lived signed URL and log the download event. */
export const requestCatalogueDownload = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        catalogue_id: z.string().uuid(),
        lead_id: z.string().uuid().optional(),
        user_agent: z.string().max(500).optional(),
        referrer: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: cat, error } = await sb
      .from("catalogues")
      .select("id, slug, file_path, title")
      .eq("id", data.catalogue_id)
      .eq("is_active", true)
      .maybeSingle();
    if (error || !cat || !cat.file_path) throw new Error("Catalogue not available");

    // Signed URL requires service role for private bucket
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from("catalogues")
      .createSignedUrl(cat.file_path, 60 * 30, { download: `${cat.slug}.pdf` });
    if (sErr || !signed) throw new Error(sErr?.message || "Could not create download link");

    await sb.from("catalogue_download_events").insert({
      catalogue_id: cat.id,
      catalogue_slug: cat.slug,
      lead_id: data.lead_id ?? null,
      user_agent: data.user_agent ?? null,
      referrer: data.referrer ?? null,
    });

    return { url: signed.signedUrl, title: cat.title };
  });

// ---------- ADMIN ----------

async function ensureAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden");
}

export const adminListCatalogues = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("catalogues")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertCatalogue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
        title: z.string().trim().min(2).max(150),
        description: z.string().trim().max(500).optional().or(z.literal("")),
        file_path: z.string().trim().max(300).optional().or(z.literal("")),
        file_size: z.number().int().nonnegative().optional(),
        sort_order: z.number().int().min(0).max(1000).optional(),
        is_active: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      file_path: data.file_path || null,
      file_size: data.file_size ?? null,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("catalogues").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    } else {
      const { data: ins, error } = await supabaseAdmin
        .from("catalogues")
        .insert(row)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: ins.id };
    }
  });

export const adminDeleteCatalogue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cat } = await supabaseAdmin.from("catalogues").select("file_path").eq("id", data.id).maybeSingle();
    if (cat?.file_path) {
      await supabaseAdmin.storage.from("catalogues").remove([cat.file_path]);
    }
    const { error } = await supabaseAdmin.from("catalogues").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin upload: PDF sent as base64. For very large PDFs (>~6MB), the browser
 * should upload directly via the storage client instead. */
export const adminUploadCatalogueFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
        base64: z.string().min(10),
        content_type: z.string().default("application/pdf"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const path = `${data.slug}-${Date.now()}.pdf`;
    const { error } = await supabaseAdmin.storage.from("catalogues").upload(path, bytes, {
      contentType: data.content_type,
      upsert: true,
    });
    if (error) throw new Error(error.message);
    return { file_path: path, file_size: bytes.byteLength };
  });

export const adminListDownloadEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("catalogue_download_events")
      .select("id, catalogue_id, catalogue_slug, lead_id, user_agent, referrer, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminListLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [dl, inq] = await Promise.all([
      supabaseAdmin.from("catalogue_downloads").select("*").order("created_at", { ascending: false }).limit(200),
      supabaseAdmin.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    return { downloads: dl.data ?? [], inquiries: inq.data ?? [] };
  });

export const isCurrentUserAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { admin: !!data, userId: context.userId };
  });
