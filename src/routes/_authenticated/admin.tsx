import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListCatalogues,
  adminUpsertCatalogue,
  adminDeleteCatalogue,
  adminUploadCatalogueFile,
  adminListDownloadEvents,
  adminListLeads,
  isCurrentUserAdmin,
} from "@/lib/catalogues.functions";
import { Upload, Trash2, Plus, LogOut, RefreshCw, Download as DL, Save, Star } from "lucide-react";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { FounderPanel } from "@/components/admin/FounderPanel";
import { categories as productCategories } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | OEMSunglasses.com" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Cat = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category_slug: string | null;
  is_primary: boolean;
  file_path: string | null;
  file_size: number | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const checkAdmin = useServerFn(isCurrentUserAdmin);
  const listCats = useServerFn(adminListCatalogues);
  const listEvents = useServerFn(adminListDownloadEvents);
  const listLeads = useServerFn(adminListLeads);

  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => checkAdmin({}) });
  const cats = useQuery<Cat[]>({
    queryKey: ["admin-catalogues"],
    queryFn: () => listCats({}) as any,
    enabled: !!admin.data?.admin,
  });
  const events = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => listEvents({}) as any,
    enabled: !!admin.data?.admin,
  });
  const leads = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => listLeads({}) as any,
    enabled: !!admin.data?.admin,
  });

  const [tab, setTab] = useState<"products" | "catalogues" | "events" | "leads" | "founder">("products");

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (admin.isLoading) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;

  if (!admin.data?.admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center border border-border p-8">
          <h1 className="font-display text-2xl text-ink">Admin access required</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your account ({admin.data?.userId?.slice(0, 8)}…) doesn't have the <code className="text-gold">admin</code> role yet.
            Ask the site owner to grant it in the database.
          </p>
          <button onClick={signOut} className="btn-outline-ink mt-6 inline-flex"><LogOut size={14} /> Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="eyebrow">OEMSunglasses.com</div>
            <h1 className="font-display text-2xl text-ink">Admin Dashboard</h1>
          </div>
          <button onClick={signOut} className="btn-outline-ink inline-flex"><LogOut size={14} /> Sign out</button>
        </div>
        <nav className="max-w-7xl mx-auto px-6 flex gap-6 -mb-px">
          {(["products", "catalogues", "events", "leads", "founder"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm uppercase tracking-widest border-b-2 ${
                tab === t ? "border-gold text-ink" : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === "products" && <ProductsPanel />}
        {tab === "catalogues" && (
          <CataloguesPanel cats={cats.data ?? []} refetch={() => qc.invalidateQueries({ queryKey: ["admin-catalogues"] })} />
        )}
        {tab === "events" && <EventsPanel events={events.data ?? []} leads={leads.data ?? { downloads: [] }} />}
        {tab === "leads" && <LeadsPanel leads={leads.data ?? { downloads: [], inquiries: [] }} />}
        {tab === "founder" && <FounderPanel />}
      </main>
    </div>
  );
}

function fmtBytes(n?: number | null) {
  if (!n) return "—";
  const mb = n / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(n / 1024).toFixed(0)} KB`;
}

function CataloguesPanel({ cats, refetch }: { cats: Cat[]; refetch: () => void }) {
  const upsert = useServerFn(adminUpsertCatalogue);
  const del = useServerFn(adminDeleteCatalogue);
  const upload = useServerFn(adminUploadCatalogueFile);
  const [adding, setAdding] = useState(false);

  const upsertMut = useMutation({
    mutationFn: (v: any) => upsert({ data: v }),
    onSuccess: () => { refetch(); setAdding(false); },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: refetch,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-ink">Catalogues</h2>
          <p className="text-xs text-muted-foreground mt-1">Upload, replace, or retire the PDFs offered on the site.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={refetch} className="btn-outline-ink"><RefreshCw size={14} /> Refresh</button>
          <button onClick={() => setAdding(true)} className="btn-gold"><Plus size={14} /> New catalogue</button>
        </div>
      </div>

      {adding && (
        <CatalogueForm
          onCancel={() => setAdding(false)}
          onSubmit={(v) => upsertMut.mutate(v)}
          uploadFn={(slug, base64) => upload({ data: { slug, base64, content_type: "application/pdf" } })}
        />
      )}

      <div className="space-y-3 mt-4">
        {cats.map((c) => (
          <CatalogueRow
            key={c.id}
            cat={c}
            onSave={(v) => upsertMut.mutate({ ...v, id: c.id })}
            onDelete={() => {
              if (confirm(`Delete "${c.title}"? This removes the PDF too.`)) delMut.mutate(c.id);
            }}
            uploadFn={(slug, base64) => upload({ data: { slug, base64, content_type: "application/pdf" } })}
          />
        ))}
        {cats.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground border border-dashed border-border p-8 text-center">No catalogues yet.</p>
        )}
      </div>
    </div>
  );
}

function CatalogueRow({
  cat,
  onSave,
  onDelete,
  uploadFn,
}: {
  cat: Cat;
  onSave: (v: any) => void;
  onDelete: () => void;
  uploadFn: (slug: string, base64: string) => Promise<{ file_path: string; file_size: number }>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border">
      <div className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-lg text-ink truncate">{cat.title}</span>
            {cat.is_primary && <span className="text-[10px] uppercase tracking-widest bg-gold text-ink px-2 py-0.5 inline-flex items-center gap-1"><Star size={10} /> Primary</span>}
            {cat.category_slug && <span className="text-[10px] uppercase tracking-widest bg-muted px-2 py-0.5">{cat.category_slug}</span>}
            {!cat.is_active && <span className="text-[10px] uppercase tracking-widest bg-muted px-2 py-0.5">Hidden</span>}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            /{cat.slug} · {fmtBytes(cat.file_size)} · Updated {new Date(cat.updated_at).toLocaleString()}
          </div>
        </div>
        <button onClick={() => setOpen(!open)} className="btn-outline-ink">{open ? "Close" : "Edit / Replace"}</button>
        <button onClick={onDelete} className="btn-outline-ink text-destructive"><Trash2 size={14} /></button>
      </div>
      {open && (
        <div className="border-t border-border p-4 bg-muted/30">
          <CatalogueForm
            initial={cat}
            onCancel={() => setOpen(false)}
            onSubmit={(v) => { onSave(v); setOpen(false); }}
            uploadFn={uploadFn}
          />
        </div>
      )}
    </div>
  );
}

function CatalogueForm({
  initial,
  onSubmit,
  onCancel,
  uploadFn,
}: {
  initial?: Partial<Cat>;
  onSubmit: (v: any) => void;
  onCancel: () => void;
  uploadFn: (slug: string, base64: string) => Promise<{ file_path: string; file_size: number }>;
}) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category_slug, setCategorySlug] = useState<string>(initial?.category_slug ?? "");
  const [is_primary, setIsPrimary] = useState<boolean>(initial?.is_primary ?? false);
  const [sort_order, setSort] = useState(initial?.sort_order ?? 0);
  const [is_active, setActive] = useState(initial?.is_active ?? true);
  const [file_path, setFilePath] = useState(initial?.file_path ?? "");
  const [file_size, setFileSize] = useState<number | null>(initial?.file_size ?? null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (f: File) => {
    setErr("");
    if (!slug) { setErr("Set a slug before uploading."); return; }
    if (f.size > 45 * 1024 * 1024) { setErr("PDF must be under 45 MB."); return; }
    setUploading(true);
    try {
      const buf = await f.arrayBuffer();
      // chunked base64 to avoid stack overflow on large files
      const bytes = new Uint8Array(buf);
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as any);
      }
      const base64 = btoa(binary);
      const res = await uploadFn(slug, base64);
      setFilePath(res.file_path);
      setFileSize(res.file_size);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Title" value={title} onChange={setTitle} required />
      <Field label="Slug (a–z, 0–9, dash)" value={slug} onChange={(v) => setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} required />
      <div className="md:col-span-2">
        <Field label="Description" value={description ?? ""} onChange={setDescription} />
      </div>
      <label className="block">
        <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Product Category</span>
        <select value={category_slug} onChange={(e) => setCategorySlug(e.target.value)} className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold">
          <option value="">— None (general) —</option>
          {productCategories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <Field label="Sort order" value={String(sort_order)} onChange={(v) => setSort(Number(v) || 0)} type="number" />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={is_primary} onChange={(e) => setIsPrimary(e.target.checked)} />
        <span className="text-sm">Primary catalogue (default download)</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={is_active} onChange={(e) => setActive(e.target.checked)} />
        <span className="text-sm">Active (visible on the site)</span>
      </label>

      <div className="md:col-span-2 border border-dashed border-border p-4">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Catalogue PDF</div>
        <div className="text-xs mb-2">
          Current file: <code>{file_path || "none"}</code> {file_size ? `· ${fmtBytes(file_size)}` : ""}
        </div>
        <label className="btn-outline-ink inline-flex cursor-pointer">
          <Upload size={14} /> {uploading ? "Uploading…" : file_path ? "Replace PDF" : "Upload PDF"}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
        {err && <p className="text-xs text-destructive mt-2">{err}</p>}
      </div>

      <div className="md:col-span-2 flex gap-2 justify-end pt-2">
        <button onClick={onCancel} className="btn-outline-ink">Cancel</button>
        <button
          onClick={() => onSubmit({ slug, title, description, category_slug, is_primary, sort_order, is_active, file_path, file_size: file_size ?? undefined })}
          className="btn-gold"
          disabled={!slug || !title}
        >
          <Save size={14} /> Save
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{label}{required && " *"}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
    </label>
  );
}

function toCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

type EventRow = { id: string; catalogue_slug: string | null; lead_id: string | null; user_agent: string | null; referrer?: string | null; created_at: string };

function EventsPanel({ events, leads }: { events: EventRow[]; leads: { downloads: any[] } }) {
  // Analytics
  const total = events.length;
  const leadsCount = leads.downloads.length;
  const bySlug = new Map<string, number>();
  const byDate = new Map<string, number>();
  events.forEach((e) => {
    const s = e.catalogue_slug ?? "unknown";
    bySlug.set(s, (bySlug.get(s) ?? 0) + 1);
    const d = new Date(e.created_at).toISOString().slice(0, 10);
    byDate.set(d, (byDate.get(d) ?? 0) + 1);
  });
  const topCatalogue = [...bySlug.entries()].sort((a, b) => b[1] - a[1])[0];

  // Category & country breakdowns come from joining lead_id -> download lead
  const leadById = new Map(leads.downloads.map((l) => [l.id, l]));
  const byCountry = new Map<string, number>();
  events.forEach((e) => {
    const l = e.lead_id ? leadById.get(e.lead_id) : null;
    const c = l?.country ?? "Unknown";
    byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
  });

  const last30 = [...byDate.entries()].sort().slice(-30);
  const maxDate = Math.max(1, ...last30.map(([, n]) => n));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total downloads" value={total} />
        <Stat label="Leads captured" value={leadsCount} />
        <Stat label="Most downloaded" value={topCatalogue ? `${topCatalogue[0]} (${topCatalogue[1]})` : "—"} />
        <Stat label="Countries" value={byCountry.size} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <BreakdownList title="Downloads by catalogue" items={[...bySlug.entries()].sort((a, b) => b[1] - a[1])} />
        <BreakdownList title="Downloads by country" items={[...byCountry.entries()].sort((a, b) => b[1] - a[1])} />
      </div>

      <div>
        <div className="eyebrow mb-2">Downloads by day (last 30)</div>
        <div className="border border-border p-4 bg-muted/20">
          {last30.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No downloads yet.</p>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {last30.map(([d, n]) => (
                <div key={d} className="flex-1 flex flex-col items-center gap-1" title={`${d}: ${n}`}>
                  <div className="w-full bg-gold" style={{ height: `${(n / maxDate) * 100}%` }} />
                  <div className="text-[9px] text-muted-foreground rotate-45 origin-left translate-y-2">{d.slice(5)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DL size={18} className="text-gold" />
            <h2 className="font-display text-xl text-ink">Download history</h2>
            <span className="text-xs text-muted-foreground">({events.length})</span>
          </div>
          <button onClick={() => toCsv(events as any, `catalogue-downloads-${Date.now()}.csv`)} className="btn-outline-ink">
            <DL size={14} /> Export CSV
          </button>
        </div>
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left"><Th>When</Th><Th>Catalogue</Th><Th>Lead</Th><Th>Country</Th><Th>User agent</Th></tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const l = e.lead_id ? leadById.get(e.lead_id) : null;
                return (
                  <tr key={e.id} className="border-t border-border">
                    <Td>{new Date(e.created_at).toLocaleString()}</Td>
                    <Td>{e.catalogue_slug ?? "—"}</Td>
                    <Td className="text-xs">{l ? `${l.name} · ${l.company}` : (e.lead_id?.slice(0, 8) ?? "—")}</Td>
                    <Td>{l?.country ?? "—"}</Td>
                    <Td className="text-xs text-muted-foreground truncate max-w-xs">{e.user_agent ?? "—"}</Td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr><Td colSpan={5} className="text-center text-muted-foreground py-8">No downloads yet.</Td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-border p-4">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl text-ink mt-1 truncate">{value}</div>
    </div>
  );
}

function BreakdownList({ title, items }: { title: string; items: [string, number][] }) {
  const max = Math.max(1, ...items.map(([, n]) => n));
  return (
    <div className="border border-border p-4">
      <div className="eyebrow mb-3">{title}</div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 10).map(([k, n]) => (
            <li key={k} className="text-sm">
              <div className="flex justify-between mb-1"><span className="truncate">{k}</span><span className="tabular-nums text-muted-foreground">{n}</span></div>
              <div className="h-1 bg-muted"><div className="h-full bg-gold" style={{ width: `${(n / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LeadsPanel({ leads }: { leads: { downloads: any[]; inquiries: any[] } }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl text-ink">Catalogue download leads ({leads.downloads.length})</h2>
          <button onClick={() => toCsv(leads.downloads, `download-leads-${Date.now()}.csv`)} className="btn-outline-ink"><DL size={14} /> Export CSV</button>
        </div>
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr className="text-left"><Th>When</Th><Th>Name</Th><Th>Company</Th><Th>Email</Th><Th>Mobile</Th><Th>City</Th><Th>Country</Th><Th>GST</Th></tr></thead>
            <tbody>
              {leads.downloads.map((l: any) => (
                <tr key={l.id} className="border-t border-border">
                  <Td>{new Date(l.created_at).toLocaleString()}</Td>
                  <Td>{l.name}</Td><Td>{l.company}</Td><Td>{l.email}</Td><Td>{l.mobile}</Td><Td>{l.city}</Td><Td>{l.country}</Td><Td>{l.gst ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl text-ink">Inquiries ({leads.inquiries.length})</h2>
          <button onClick={() => toCsv(leads.inquiries, `inquiries-${Date.now()}.csv`)} className="btn-outline-ink"><DL size={14} /> Export CSV</button>
        </div>
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr className="text-left"><Th>When</Th><Th>Name</Th><Th>Company</Th><Th>Email</Th><Th>Product</Th><Th>Qty</Th></tr></thead>
            <tbody>
              {leads.inquiries.map((l: any) => (
                <tr key={l.id} className="border-t border-border">
                  <Td>{new Date(l.created_at).toLocaleString()}</Td>
                  <Td>{l.name}</Td><Td>{l.company ?? "—"}</Td><Td>{l.email}</Td>
                  <Td>{l.product_code ?? l.product_category ?? "—"}</Td><Td>{l.quantity ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">{children}</th>;
}
function Td({ children, className = "", colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={`px-3 py-2 ${className}`}>{children}</td>;
}
