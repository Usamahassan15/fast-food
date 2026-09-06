import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Your profile — Slice & Co" },
      { name: "description", content: "Update your name, phone number and default delivery address for faster Slice & Co checkout." },
      { property: "og:title", content: "Your profile — Slice & Co" },
      { property: "og:description", content: "Update your delivery details for faster checkout." },
    ],
  }),
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setAddress(profile.address ?? "");
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, phone, address });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-5xl">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">Saved details are pre-filled at checkout.</p>
        <form onSubmit={save} className="mt-8 space-y-3 rounded-2xl border border-border bg-white p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Signed in as {user?.email}</div>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Default delivery address" rows={3} className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <button disabled={saving} className="w-full rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
