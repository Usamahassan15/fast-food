import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/menu")({ component: MenuPage });

function MenuPage() {
  const { add } = useCart();
  const [cat, setCat] = useState<string>("All");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").order("category");
      if (error) throw error;
      return data;
    },
  });

  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const filtered = cat === "All" ? items : items.filter((i) => i.category === cat);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-5xl md:text-6xl">Our Menu</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition ${cat === c ? "bg-accent text-accent-foreground" : "bg-white border border-border hover:bg-muted"}`}>
              {c}
            </button>
          ))}
        </div>
        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading menu…</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((d) => (
              <article key={d.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {d.image_url ? (
                    <img src={d.image_url} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-6xl">🍕</div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-foreground">{d.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-2xl">{d.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{d.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-ink">{formatPrice(d.price_cents)}</span>
                    <button
                      onClick={() => { add({ id: d.id, name: d.name, price_cents: d.price_cents, image_url: d.image_url }); toast.success(`${d.name} added to cart`); }}
                      className="rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90">
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
