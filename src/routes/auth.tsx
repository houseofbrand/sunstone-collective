import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In | OEMSunglasses.com" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md border border-border bg-card p-8">
        <div className="eyebrow mb-2">OEMSunglasses.com</div>
        <h1 className="font-display text-3xl text-ink">Admin Access</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to manage products and leads.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label className="block">
            <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          </label>
          <label className="block">
            <span className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          </label>
          {err && <p className="text-xs text-destructive">{err}</p>}
          <button disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-60">
            {loading ? "Please wait…" : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Admin accounts are invitation-only. Contact your administrator for access.
        </p>
        <Link to="/" className="text-xs text-muted-foreground hover:text-ink mt-6 block text-center">← Back to site</Link>
      </div>
    </div>
  );
}
