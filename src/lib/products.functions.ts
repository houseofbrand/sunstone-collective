import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const BUCKET = "product-images";
const URL_TTL_SECONDS = 60 * 60 * 24 * 365 * 10; // 10 years

const publicClient = () =>
  createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

export type PublicProduct = {
  id: string;
  code: string;
  name: string;
  category_slug: string;
  price: number;
  colours: string[];
  frame_material: string;
  lens_material: string;
  weight: string;
  description: string | null;
  sort_order: number;
  images: Array<{ id: string; url: string; is_primary: boolean; sort_order: number; alt_text: string | null }>;
};

function shapeProduct(row: any, images: any[]): PublicProduct {
  const ordered = images
    .filter((i) => i.product_id === row.id)
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order);
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    category_slug: row.category_slug,
    price: row.price,
    colours: row.colours ?? [],
    frame_material: row.frame_material ?? "",
    lens_material: row.lens_material ?? "",
    weight: row.weight ?? "",
    description: row.description ?? null,
    sort_order: row.sort_order ?? 0,
    images: ordered.map((i) => ({
      id: i.id,
      url: i.public_url,
      is_primary: !!i.is_primary,
      sort_order: i.sort_order ?? 0,
      alt_text: i.alt_text ?? null,
    })),
  };
}

/** Public: list all active products with their images. */
export const listPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [{ data: prods, error: pe }, { data: imgs, error: ie }] = await Promise.all([
    sb.from("products").select("*").eq("is_active", true).order("sort_order"),
    sb.from("product_images").select("*"),
  ]);
  if (pe) throw new Error(pe.message);
  if (ie) throw new Error(ie.message);
  return (prods ?? []).map((p) => shapeProduct(p, imgs ?? []));
});

/** Public: fetch one product by code. */
export const getPublicProductByCode = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ code: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: p, error } = await sb
      .from("products")
      .select("*")
      .eq("code", data.code)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!p) return null;
    const { data: imgs } = await sb.from("product_images").select("*").eq("product_id", p.id);
    return shapeProduct(p, imgs ?? []);
  });

// ---------- ADMIN ----------

async function ensureAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden");
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(2).max(60),
  name: z.string().trim().min(2).max(120),
  category_slug: z.string().trim().min(2).max(60),
  price: z.number().int().min(0).max(1_000_000),
  colours: z.array(z.string().trim().max(60)).max(30).default([]),
  frame_material: z.string().trim().max(120).default(""),
  lens_material: z.string().trim().max(120).default(""),
  weight: z.string().trim().max(40).default(""),
  description: z.string().trim().max(2000).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000).default(0),
  is_active: z.boolean().default(true),
});

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: prods, error: pe }, { data: imgs, error: ie }] = await Promise.all([
      supabaseAdmin.from("products").select("*").order("sort_order"),
      supabaseAdmin.from("product_images").select("*"),
    ]);
    if (pe) throw new Error(pe.message);
    if (ie) throw new Error(ie.message);
    return (prods ?? []).map((p) => ({
      ...p,
      images: (imgs ?? [])
        .filter((i) => i.product_id === p.id)
        .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order),
    }));
  });

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      code: data.code,
      name: data.name,
      category_slug: data.category_slug,
      price: data.price,
      colours: data.colours,
      frame_material: data.frame_material,
      lens_material: data.lens_material,
      weight: data.weight,
      description: data.description ?? null,
      sort_order: data.sort_order,
      is_active: data.is_active,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("products").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: ins, error } = await supabaseAdmin.from("products").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // remove all images from storage first
    const { data: imgs } = await supabaseAdmin.from("product_images").select("storage_path").eq("product_id", data.id);
    if (imgs && imgs.length) {
      await supabaseAdmin.storage.from(BUCKET).remove(imgs.map((i) => i.storage_path));
    }
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin: upload image. Image is optimized client-side (WebP) before this call. */
export const adminUploadProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        product_id: z.string().uuid(),
        base64: z.string().min(10),
        content_type: z.enum(["image/webp", "image/jpeg", "image/png"]),
        ext: z.enum(["webp", "jpg", "png"]),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
        alt_text: z.string().max(200).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const path = `${data.product_id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${data.ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: data.content_type, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, URL_TTL_SECONDS);
    if (sErr || !signed) throw new Error(sErr?.message || "Sign URL failed");

    // Determine primary / sort_order defaults
    const { data: existing } = await supabaseAdmin
      .from("product_images")
      .select("id, is_primary, sort_order")
      .eq("product_id", data.product_id);
    const hasPrimary = (existing ?? []).some((i) => i.is_primary);
    const maxSort = (existing ?? []).reduce((m, i) => Math.max(m, i.sort_order ?? 0), -1);

    const { data: ins, error: insErr } = await supabaseAdmin
      .from("product_images")
      .insert({
        product_id: data.product_id,
        storage_path: path,
        public_url: signed.signedUrl,
        is_primary: !hasPrimary,
        sort_order: maxSort + 1,
        width: data.width ?? null,
        height: data.height ?? null,
        size_bytes: bytes.byteLength,
        alt_text: data.alt_text ?? null,
      })
      .select("*")
      .single();
    if (insErr) throw new Error(insErr.message);
    return ins;
  });

export const adminReplaceProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        image_id: z.string().uuid(),
        base64: z.string().min(10),
        content_type: z.enum(["image/webp", "image/jpeg", "image/png"]),
        ext: z.enum(["webp", "jpg", "png"]),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cur, error } = await supabaseAdmin
      .from("product_images")
      .select("*")
      .eq("id", data.image_id)
      .maybeSingle();
    if (error || !cur) throw new Error("Image not found");

    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const newPath = `${cur.product_id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${data.ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(newPath, bytes, { contentType: data.content_type });
    if (upErr) throw new Error(upErr.message);

    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(newPath, URL_TTL_SECONDS);
    if (sErr || !signed) throw new Error(sErr?.message || "Sign URL failed");

    // remove old file
    await supabaseAdmin.storage.from(BUCKET).remove([cur.storage_path]);

    const { data: upd, error: uErr } = await supabaseAdmin
      .from("product_images")
      .update({
        storage_path: newPath,
        public_url: signed.signedUrl,
        width: data.width ?? null,
        height: data.height ?? null,
        size_bytes: bytes.byteLength,
      })
      .eq("id", data.image_id)
      .select("*")
      .single();
    if (uErr) throw new Error(uErr.message);
    return upd;
  });

export const adminDeleteProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ image_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cur } = await supabaseAdmin
      .from("product_images")
      .select("storage_path, product_id, is_primary")
      .eq("id", data.image_id)
      .maybeSingle();
    if (!cur) return { ok: true };
    await supabaseAdmin.storage.from(BUCKET).remove([cur.storage_path]);
    const { error } = await supabaseAdmin.from("product_images").delete().eq("id", data.image_id);
    if (error) throw new Error(error.message);

    // If deleted was primary, promote first remaining by sort_order
    if (cur.is_primary) {
      const { data: rest } = await supabaseAdmin
        .from("product_images")
        .select("id")
        .eq("product_id", cur.product_id)
        .order("sort_order", { ascending: true })
        .limit(1);
      if (rest && rest[0]) {
        await supabaseAdmin.from("product_images").update({ is_primary: true }).eq("id", rest[0].id);
      }
    }
    return { ok: true };
  });

export const adminSetPrimaryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ image_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cur } = await supabaseAdmin
      .from("product_images")
      .select("product_id")
      .eq("id", data.image_id)
      .maybeSingle();
    if (!cur) throw new Error("Image not found");
    // Clear all first (unique partial index prevents two primaries)
    await supabaseAdmin
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", cur.product_id);
    const { error } = await supabaseAdmin
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", data.image_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ product_id: z.string().uuid(), ordered_ids: z.array(z.string().uuid()).min(1) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Set sort_order = index for each id
    for (let i = 0; i < data.ordered_ids.length; i++) {
      await supabaseAdmin
        .from("product_images")
        .update({ sort_order: i })
        .eq("id", data.ordered_ids[i])
        .eq("product_id", data.product_id);
    }
    return { ok: true };
  });

export const adminUpdateImageAlt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ image_id: z.string().uuid(), alt_text: z.string().max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("product_images")
      .update({ alt_text: data.alt_text })
      .eq("id", data.image_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
