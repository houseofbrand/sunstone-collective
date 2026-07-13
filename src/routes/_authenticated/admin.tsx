import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminListLeads, isCurrentUserAdmin } from "@/lib/catalogues.functions";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { FounderPanel } from "@/components/admin/FounderPanel";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | OEMSunglasses.com" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type InquiryLead = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  mobile: string;
  country: string | null;
  product_category: string | null;
  quantity: number | null;
  message: string | null;
  source: string | null;
};

function AdminPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(isCurrentUserAdmin);
  const listLeads = useServerFn(adminListLeads);
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => checkAdmin({}) });
  const leads = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => listLeads({}) as Promise<{ inquiries: InquiryLead[] }>,
    enabled: !!admin.data?.admin,
  });
  const [tab, setTab] = useState<"products" | "leads" | "founder">("products");

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
            Your account ({admin.data?.userId?.slice(0, 8)}…) doesn't have the{" "}
            <code className="text-gold">admin</code> role yet. Ask the site owner to grant it in the
            database.
          </p>
          <button onClick={signOut} className="btn-outline-ink mt-6 inline-flex">
            <LogOut size={14} /> Sign out
          </button>
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
          <button onClick={signOut} className="btn-outline-ink inline-flex">
            <LogOut size={14} /> Sign out
          </button>
        </div>
        <nav className="max-w-7xl mx-auto px-6 flex gap-6 -mb-px">
          {(["products", "leads", "founder"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`py-3 text-sm uppercase tracking-widest border-b-2 ${
                tab === item
                  ? "border-gold text-ink"
                  : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === "products" && <ProductsPanel />}
        {tab === "leads" && <LeadsPanel leads={leads.data?.inquiries ?? []} />}
        {tab === "founder" && <FounderPanel />}
      </main>
    </div>
  );
}

function LeadsPanel({ leads }: { leads: InquiryLead[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display text-xl text-ink">OEM catalog requests ({leads.length})</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Form inquiries submitted across the website.
          </p>
        </div>
        <button
          onClick={() => toCsv(leads, `oem-catalog-requests-${Date.now()}.csv`)}
          className="btn-outline-ink"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <Th>When</Th>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>Email</Th>
              <Th>WhatsApp</Th>
              <Th>Country</Th>
              <Th>Category</Th>
              <Th>Qty</Th>
              <Th>Source</Th>
              <Th>Message</Th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-border align-top">
                <Td>{new Date(lead.created_at).toLocaleString()}</Td>
                <Td>{lead.name}</Td>
                <Td>{lead.company ?? "—"}</Td>
                <Td>{lead.email}</Td>
                <Td>{lead.mobile}</Td>
                <Td>{lead.country ?? "—"}</Td>
                <Td>{lead.product_category ?? "—"}</Td>
                <Td>{lead.quantity ?? "—"}</Td>
                <Td>{lead.source ?? "—"}</Td>
                <Td className="max-w-xs whitespace-normal text-xs text-muted-foreground">
                  {lead.message ?? "—"}
                </Td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <Td colSpan={10} className="py-10 text-center text-muted-foreground">
                  No requests yet.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function toCsv(rows: InquiryLead[], filename: string) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]) as (keyof InquiryLead)[];
  const escapeValue = (value: unknown) => {
    if (value === null || value === undefined) return "";
    const text = String(value).replace(/"/g, '""');
    return /[",\n]/.test(text) ? `"${text}"` : text;
  };
  const csv = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => escapeValue(row[column])).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-3 py-2 ${className}`}>
      {children}
    </td>
  );
}
