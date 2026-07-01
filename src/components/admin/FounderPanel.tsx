import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Save, Upload, Plus, Trash2, RefreshCw } from "lucide-react";
import { getFounder, adminUpdateFounder, adminUploadFounderImage, type FounderProfile, type Achievement } from "@/lib/founder.functions";

export function FounderPanel() {
  const qc = useQueryClient();
  const load = useServerFn(getFounder);
  const save = useServerFn(adminUpdateFounder);
  const uploadImg = useServerFn(adminUploadFounderImage);

  const q = useQuery({ queryKey: ["admin-founder"], queryFn: () => load({}) as any });
  const [f, setF] = useState<FounderProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => { if (q.data && !f) setF(q.data as FounderProfile); }, [q.data]);

  const saveMut = useMutation({
    mutationFn: (v: FounderProfile) => save({ data: v }),
    onSuccess: () => { setOk("Saved."); setErr(""); qc.invalidateQueries({ queryKey: ["admin-founder"] }); setTimeout(() => setOk(""), 2000); },
    onError: (e: any) => setErr(e?.message ?? "Save failed"),
  });

  if (!f) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const set = <K extends keyof FounderProfile>(k: K, v: FounderProfile[K]) => setF({ ...f, [k]: v });

  const handleImage = async (file: File) => {
    setErr("");
    if (file.size > 8 * 1024 * 1024) { setErr("Image must be under 8 MB."); return; }
    setUploading(true);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = ""; const chunk = 0x8000;
      for (let i = 0; i < buf.length; i += chunk) bin += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + chunk)) as any);
      const base64 = btoa(bin);
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const res = await uploadImg({ data: { base64, content_type: file.type || "image/jpeg", ext } });
      set("image_url", res.url);
    } catch (e: any) { setErr(e?.message ?? "Upload failed"); }
    finally { setUploading(false); }
  };

  const addAch = () => set("achievements", [...f.achievements, { value: "", label: "" }]);
  const updAch = (i: number, patch: Partial<Achievement>) => {
    const next = [...f.achievements]; next[i] = { ...next[i], ...patch }; set("achievements", next);
  };
  const delAch = (i: number) => set("achievements", f.achievements.filter((_, x) => x !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-ink">Founder Profile</h2>
          <p className="text-xs text-muted-foreground mt-1">Edit the founder details shown on the homepage and /founder page.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => qc.invalidateQueries({ queryKey: ["admin-founder"] })} className="btn-outline-ink"><RefreshCw size={14} /> Refresh</button>
          <button onClick={() => saveMut.mutate(f)} disabled={saveMut.isPending} className="btn-gold"><Save size={14} /> {saveMut.isPending ? "Saving…" : "Save changes"}</button>
        </div>
      </div>

      {err && <p className="text-sm text-destructive mb-3">{err}</p>}
      {ok && <p className="text-sm text-green-600 mb-3">{ok}</p>}

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <div>
          <div className="aspect-[4/5] border border-border overflow-hidden bg-muted">
            {f.image_url ? <img src={f.image_url} alt="Founder" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">No image</div>}
          </div>
          <label className="btn-outline-ink inline-flex mt-3 cursor-pointer w-full justify-center">
            <Upload size={14} /> {uploading ? "Uploading…" : "Replace photo"}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
          </label>
          <p className="text-[10px] text-muted-foreground mt-2 break-all">{f.image_url}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Name" value={f.name} onChange={(v) => set("name", v)} />
          <Field label="Designation" value={f.designation} onChange={(v) => set("designation", v)} />
          <div className="md:col-span-2">
            <Area label="Biography (blank line separates paragraphs)" value={f.bio} onChange={(v) => set("bio", v)} rows={8} />
          </div>
          <div className="md:col-span-2">
            <Area label="Quote" value={f.quote} onChange={(v) => set("quote", v)} rows={3} />
          </div>
          <Field label="Website URL" value={f.website_url} onChange={(v) => set("website_url", v)} />
          <Field label="LinkedIn URL" value={f.linkedin_url} onChange={(v) => set("linkedin_url", v)} />
          <Field label="Instagram URL" value={f.instagram_url} onChange={(v) => set("instagram_url", v)} />
          <Field label="Facebook URL" value={f.facebook_url} onChange={(v) => set("facebook_url", v)} />
          <Field label="YouTube URL" value={f.youtube_url} onChange={(v) => set("youtube_url", v)} />

          <div className="md:col-span-2 border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="eyebrow">Achievement Counters</div>
              <button onClick={addAch} className="btn-outline-ink text-xs"><Plus size={12} /> Add</button>
            </div>
            <div className="space-y-2">
              {f.achievements.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={a.value} onChange={(e) => updAch(i, { value: e.target.value })} placeholder="25+" className="w-24 border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:border-gold" />
                  <input value={a.label} onChange={(e) => updAch(i, { label: e.target.value })} placeholder="Years of Experience" className="flex-1 border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:border-gold" />
                  <button onClick={() => delAch(i)} className="btn-outline-ink text-destructive"><Trash2 size={12} /></button>
                </div>
              ))}
              {f.achievements.length === 0 && <p className="text-xs text-muted-foreground">No achievements yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
    </label>
  );
}
function Area({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
    </label>
  );
}
