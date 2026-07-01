import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  adminListProducts,
  adminUpsertProduct,
  adminDeleteProduct,
  adminUploadProductImage,
  adminReplaceProductImage,
  adminDeleteProductImage,
  adminSetPrimaryImage,
  adminReorderImages,
  adminUpdateImageAlt,
} from "@/lib/products.functions";
import { categories } from "@/lib/products";
import {
  Plus,
  Trash2,
  Save,
  Upload,
  Star,
  Image as ImageIcon,
  RefreshCw,
  Pencil,
  GripVertical,
  ChevronLeft,
} from "lucide-react";

type ImgRow = {
  id: string;
  product_id: string;
  storage_path: string;
  public_url: string;
  is_primary: boolean;
  sort_order: number;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
};

type ProdRow = {
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
  is_active: boolean;
  updated_at: string;
  images: ImgRow[];
};

const MAX_DIM = 1600;
const QUALITY = 0.85;

async function optimizeImage(file: File): Promise<{
  base64: string;
  content_type: "image/webp" | "image/jpeg" | "image/png";
  ext: "webp" | "jpg" | "png";
  width: number;
  height: number;
}> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error("Only JPG, PNG, or WebP images are supported.");
  }
  if (file.size > 20 * 1024 * 1024) throw new Error("Image must be under 20 MB.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob = await new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Encode failed"))), "image/webp", QUALITY),
  );
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as any);
  }
  return {
    base64: btoa(binary),
    content_type: "image/webp",
    ext: "webp",
    width: w,
    height: h,
  };
}

export function ProductsPanel() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListProducts);
  const list = useQuery<ProdRow[]>({
    queryKey: ["admin-products"],
    queryFn: () => listFn({}) as any,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const selected = useMemo(
    () => list.data?.find((p) => p.id === selectedId) ?? null,
    [list.data, selectedId],
  );

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-products"] });

  if (selected) {
    return (
      <ProductEditor
        product={selected}
        onBack={() => setSelectedId(null)}
        onChanged={refresh}
      />
    );
  }

  if (creating) {
    return (
      <ProductEditor
        product={null}
        onBack={() => setCreating(false)}
        onChanged={(id) => {
          refresh();
          setCreating(false);
          if (id) setSelectedId(id);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-ink">Products</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Full catalogue management. Click a product to edit details and manage images.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh} className="btn-outline-ink"><RefreshCw size={14} /> Refresh</button>
          <button onClick={() => setCreating(true)} className="btn-gold"><Plus size={14} /> New product</button>
        </div>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground w-16">Img</th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">Code</th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">Name</th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">Category</th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">Price</th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">Images</th>
              <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">Active</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((p) => {
              const primary = p.images.find((i) => i.is_primary) ?? p.images[0];
              return (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="w-12 h-12 bg-secondary overflow-hidden">
                      {primary ? (
                        <img src={primary.public_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon size={14} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{p.code}</td>
                  <td className="px-3 py-2 font-display">{p.name}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{p.category_slug}</td>
                  <td className="px-3 py-2">₹{p.price}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{p.images.length}</td>
                  <td className="px-3 py-2">
                    {p.is_active ? (
                      <span className="text-[10px] uppercase tracking-widest text-gold">Live</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest bg-muted px-2 py-0.5">Hidden</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => setSelectedId(p.id)} className="btn-outline-ink">
                      <Pencil size={12} /> Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {list.data && list.data.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted-foreground py-10">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductEditor({
  product,
  onBack,
  onChanged,
}: {
  product: ProdRow | null;
  onBack: () => void;
  onChanged: (id?: string) => void;
}) {
  const upsertFn = useServerFn(adminUpsertProduct);
  const deleteFn = useServerFn(adminDeleteProduct);

  const [code, setCode] = useState(product?.code ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [category_slug, setCat] = useState(product?.category_slug ?? categories[0].slug);
  const [price, setPrice] = useState(product?.price ?? 0);
  const [colours, setColours] = useState((product?.colours ?? []).join(", "));
  const [frame_material, setFrame] = useState(product?.frame_material ?? "");
  const [lens_material, setLens] = useState(product?.lens_material ?? "");
  const [weight, setWeight] = useState(product?.weight ?? "");
  const [description, setDesc] = useState(product?.description ?? "");
  const [sort_order, setSort] = useState(product?.sort_order ?? 0);
  const [is_active, setActive] = useState(product?.is_active ?? true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setErr("");
    setSaving(true);
    try {
      const res = await upsertFn({
        data: {
          id: product?.id,
          code: code.trim(),
          name: name.trim(),
          category_slug,
          price: Number(price) || 0,
          colours: colours.split(",").map((c) => c.trim()).filter(Boolean),
          frame_material,
          lens_material,
          weight,
          description: description || null,
          sort_order: Number(sort_order) || 0,
          is_active,
        },
      });
      onChanged(res.id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? All its images will be removed too.`)) return;
    await deleteFn({ data: { id: product.id } });
    onChanged();
    onBack();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn-outline-ink"><ChevronLeft size={14} /> Back to products</button>
        <div className="flex gap-2">
          {product && <button onClick={del} className="btn-outline-ink text-destructive"><Trash2 size={14} /> Delete</button>}
          <button onClick={save} disabled={saving || !code || !name} className="btn-gold disabled:opacity-60">
            <Save size={14} /> {saving ? "Saving…" : "Save details"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h3 className="font-display text-lg text-ink mb-4">Product details</h3>
          <div className="grid grid-cols-2 gap-3">
            <F label="Code (SKU) *" value={code} onChange={setCode} />
            <F label="Name *" value={name} onChange={setName} />
            <label className="block col-span-2">
              <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Category</span>
              <select value={category_slug} onChange={(e) => setCat(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold">
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name} ({c.slug})</option>)}
              </select>
            </label>
            <F label="Price (₹)" value={String(price)} onChange={(v) => setPrice(Number(v) || 0)} type="number" />
            <F label="Sort order" value={String(sort_order)} onChange={(v) => setSort(Number(v) || 0)} type="number" />
            <F label="Frame material" value={frame_material} onChange={setFrame} />
            <F label="Lens material" value={lens_material} onChange={setLens} />
            <F label="Weight" value={weight} onChange={setWeight} />
            <label className="col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" checked={is_active} onChange={(e) => setActive(e.target.checked)} />
              <span className="text-sm">Active (visible on the site)</span>
            </label>
            <label className="block col-span-2">
              <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Colours (comma-separated)</span>
              <input value={colours} onChange={(e) => setColours(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            </label>
            <label className="block col-span-2">
              <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Description</span>
              <textarea value={description ?? ""} onChange={(e) => setDesc(e.target.value)} rows={4}
                className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            </label>
          </div>
          {err && <p className="text-xs text-destructive mt-3">{err}</p>}
        </section>

        <section>
          <h3 className="font-display text-lg text-ink mb-4">Images</h3>
          {product ? (
            <ImagesManager product={product} onChanged={() => onChanged()} />
          ) : (
            <p className="text-sm text-muted-foreground border border-dashed border-border p-6">
              Save the product first, then upload images here.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function ImagesManager({ product, onChanged }: { product: ProdRow; onChanged: () => void }) {
  const uploadFn = useServerFn(adminUploadProductImage);
  const replaceFn = useServerFn(adminReplaceProductImage);
  const deleteFn = useServerFn(adminDeleteProductImage);
  const primaryFn = useServerFn(adminSetPrimaryImage);
  const reorderFn = useServerFn(adminReorderImages);
  const altFn = useServerFn(adminUpdateImageAlt);

  const [items, setItems] = useState<ImgRow[]>(product.images);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setItems(product.images), [product.images]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const uploadMut = useMutation({
    mutationFn: async (files: File[]) => {
      setErr("");
      setUploading(true);
      try {
        for (const f of files) {
          const opt = await optimizeImage(f);
          await uploadFn({ data: { product_id: product.id, ...opt } });
        }
      } finally {
        setUploading(false);
      }
    },
    onSuccess: onChanged,
    onError: (e) => setErr(e instanceof Error ? e.message : "Upload failed"),
  });

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    await reorderFn({ data: { product_id: product.id, ordered_ids: next.map((i) => i.id) } });
    onChanged();
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-gold"
        >
          <Upload size={14} /> {uploading ? "Optimizing & uploading…" : "Upload images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) uploadMut.mutate(files);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
        <span className="text-xs text-muted-foreground self-center">JPG / PNG / WebP · auto-optimized to ≤{MAX_DIM}px WebP</span>
      </div>
      {err && <p className="text-xs text-destructive mb-3">{err}</p>}

      {items.length === 0 && (
        <div className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No images yet. Upload your first image to make this product show on the site.
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((img) => (
              <SortableImage
                key={img.id}
                img={img}
                onPrimary={async () => { await primaryFn({ data: { image_id: img.id } }); onChanged(); }}
                onDelete={async () => {
                  if (!confirm("Delete this image?")) return;
                  await deleteFn({ data: { image_id: img.id } });
                  onChanged();
                }}
                onReplace={async (file) => {
                  const opt = await optimizeImage(file);
                  await replaceFn({ data: { image_id: img.id, ...opt } });
                  onChanged();
                }}
                onAlt={async (t) => { await altFn({ data: { image_id: img.id, alt_text: t } }); onChanged(); }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableImage({
  img,
  onPrimary,
  onDelete,
  onReplace,
  onAlt,
}: {
  img: ImgRow;
  onPrimary: () => void;
  onDelete: () => void;
  onReplace: (f: File) => Promise<void>;
  onAlt: (t: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const replaceRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(img.alt_text ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <div ref={setNodeRef} style={style} className={`border ${img.is_primary ? "border-gold" : "border-border"} bg-card`}>
      <div className="relative aspect-square bg-secondary">
        <img src={img.public_url} alt={img.alt_text ?? ""} className="w-full h-full object-cover" />
        <button
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 bg-background border border-border p-1 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical size={12} />
        </button>
        {img.is_primary && (
          <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
            <Star size={10} /> Primary
          </div>
        )}
      </div>
      <div className="p-2 space-y-2">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => alt !== (img.alt_text ?? "") && onAlt(alt)}
          placeholder="Alt text (SEO)"
          className="w-full border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:border-gold"
        />
        <div className="flex gap-1 flex-wrap">
          {!img.is_primary && (
            <button onClick={onPrimary} className="btn-outline-ink text-xs !px-2 !py-1">
              <Star size={11} /> Set primary
            </button>
          )}
          <button
            onClick={() => replaceRef.current?.click()}
            disabled={busy}
            className="btn-outline-ink text-xs !px-2 !py-1"
          >
            <Upload size={11} /> {busy ? "…" : "Replace"}
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try { await onReplace(f); } finally { setBusy(false); }
              if (replaceRef.current) replaceRef.current.value = "";
            }}
          />
          <button onClick={onDelete} className="btn-outline-ink text-xs !px-2 !py-1 text-destructive">
            <Trash2 size={11} />
          </button>
        </div>
        <div className="text-[10px] text-muted-foreground">
          {img.width && img.height ? `${img.width}×${img.height}` : ""}
          {img.size_bytes ? ` · ${(img.size_bytes / 1024).toFixed(0)} KB` : ""}
        </div>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
    </label>
  );
}
