import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";

type Search = { next?: string };

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Slice & Co" },
      { name: "description", content: "Sign in to Slice & Co to place orders, save your delivery details and track every order from the kitchen to your door." },
      { property: "og:title", content: "Sign in — Slice & Co" },
      { property: "og:description", content: "Sign in to order and track your Slice & Co deliveries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({ next: typeof s.next === "string" ? s.next : undefined }),
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { next } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: (next as "/") ?? "/" });
  }, [user, next, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created! You're signed in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setLoading(false);
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <h1 className="text-5xl">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-2 text-muted-foreground">{mode === "signin" ? "Sign in to place your order." : "Join Slice & Co in seconds."}</p>
        <form onSubmit={submit} className="mt-8 space-y-3 rounded-2xl border border-border bg-white p-6">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          )}
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <button disabled={loading} className="w-full rounded-full bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground disabled:opacity-50">
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
          <button type="button" onClick={google} className="w-full rounded-full border border-border bg-white px-4 py-3 text-sm font-bold hover:bg-muted">
            Continue with Google
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 text-center text-sm text-muted-foreground hover:text-accent">
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>
        <Link to="/" className="mt-2 text-center text-xs text-muted-foreground hover:underline">← Back home</Link>
      </div>
    </div>
  );
}
