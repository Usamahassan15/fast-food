import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/roles";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin panel — Slice & Co" },
      { name: "description", content: "Manage the Slice & Co menu, track live orders and update order status from one dashboard." },
      { property: "og:title", content: "Admin panel — Slice & Co" },
      { property: "og:description", content: "Manage menu items and orders for Slice & Co." },
    ],
  }),
});

const STATUSES = ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"] as const;

type MenuRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  price_cents: number;
  image_url: string | null;
};

type Draft = {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image_url: string;
};

const emptyDraft: Draft = { name: "", description: "", category: "Pizza", price: "", image_url: "" };

function AdminPage() {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "menu">("orders");

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <p className="mx-auto max-w-5xl px-4 py-16 text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-5xl">Staff only</h1>
          <p className="mt-3 text-muted-foreground">
            This area is for restaurant staff. Ask an administrator to grant your account access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-5xl md:text-6xl">Admin Panel</h1>
        <div className="mt-6 flex gap-2">
          {(["orders", "menu"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider transition ${tab === t ? "bg-accent text-accent-foreground" : "border border-border bg-white hover:bg-muted"}`}>
              {t}
            </button>
          ))}
        </div>
        {tab === "orders" ? <OrdersAdmin /> : <MenuAdmin />}
      </div>
    </div>
  );
}

function OrdersAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const stats = useMemo(() => {
    const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total_cents, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    return { revenue, pending, total: orders.length };
  }, [orders]);

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Order updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders" value={String(stats.total)} />
        <StatCard label="Awaiting action" value={String(stats.pending)} />
        <StatCard label="Revenue" value={formatPrice(stats.revenue)} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${filter === s ? "bg-brand text-brand-foreground" : "border border-border bg-white hover:bg-muted"}`}>
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading orders…</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-white p-10 text-center text-muted-foreground">No orders here yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {shown.map((o) => {
            const items = (o.items as unknown as { name: string; qty: number }[]) || [];
            return (
              <div key={o.id} className="rounded-2xl border border-border bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm">{o.delivery_address} · {o.phone}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black">{formatPrice(o.total_cents)}</span>
                    <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}
                      className="rounded-full border border-border bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-accent">
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-black">{value}</div>
    </div>
  );
}

function MenuAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-menu"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").order("category").order("name");
      if (error) throw error;
      return data as MenuRow[];
    },
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const cents = Math.round(parseFloat(draft.price || "0") * 100);
    if (!draft.name || !draft.category || !cents) { toast.error("Name, category and price are required"); return; }
    setSaving(true);
    const payload = {
      name: draft.name,
      description: draft.description,
      category: draft.category,
      price_cents: cents,
      image_url: draft.image_url || null,
    };
    const { error } = draft.id
      ? await supabase.from("menu_items").update(payload).eq("id", draft.id)
      : await supabase.from("menu_items").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(draft.id ? "Item updated" : "Item added");
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin-menu"] });
    qc.invalidateQueries({ queryKey: ["menu"] });
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the menu?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Item removed");
    qc.invalidateQueries({ queryKey: ["admin-menu"] });
    qc.invalidateQueries({ queryKey: ["menu"] });
  };

  return (
    <div className="mt-8">
      <button onClick={() => setDraft({ ...emptyDraft })}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90">
        <Plus className="h-4 w-4" /> New item
      </button>

      {draft && (
        <form onSubmit={save} className="mt-5 grid gap-3 rounded-2xl border border-border bg-white p-6 sm:grid-cols-2">
          <div className="flex items-center justify-between sm:col-span-2">
            <h3 className="text-2xl">{draft.id ? "Edit item" : "New item"}</h3>
            <button type="button" onClick={() => setDraft(null)} className="rounded-full p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" className="rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Category" className="rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Price (e.g. 12.99)" inputMode="decimal" className="rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <input value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} placeholder="Image URL (optional)" className="rounded-lg border border-border px-3 py-2 outline-none focus:border-accent" />
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Description" rows={2} className="rounded-lg border border-border px-3 py-2 outline-none focus:border-accent sm:col-span-2" />
          <button disabled={saving} className="rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90 disabled:opacity-50 sm:col-span-2">
            {saving ? "Saving…" : "Save item"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading menu…</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((it) => (
                <tr key={it.id}>
                  <td className="px-4 py-3 font-semibold">{it.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{it.category}</td>
                  <td className="px-4 py-3 font-black">{formatPrice(it.price_cents)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDraft({ id: it.id, name: it.name, description: it.description ?? "", category: it.category, price: (it.price_cents / 100).toFixed(2), image_url: it.image_url ?? "" })}
                      className="rounded-full p-2 hover:bg-muted" aria-label={`Edit ${it.name}`}><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => del(it.id, it.name)} className="rounded-full p-2 text-accent hover:bg-muted" aria-label={`Delete ${it.name}`}><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
