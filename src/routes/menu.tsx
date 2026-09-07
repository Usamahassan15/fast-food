import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

type MenuSearch = { q?: string };

export const Route = createFileRoute("/menu")({
  component: MenuPage,
  validateSearch: (s: Record<string, unknown>): MenuSearch => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Full menu — pizza, wings, sides & drinks | Slice & Co" },
      { name: "description", content: "Browse the full Slice & Co menu: stone-baked pizzas, saucy wings, loaded sides and ice-cold drinks. Add to cart and get it delivered hot." },
      { property: "og:title", content: "Full menu — Slice & Co" },
      { property: "og:description", content: "Stone-baked pizzas, saucy wings, loaded sides and ice-cold drinks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function MenuPage() {
  const { add } = useCart();
  const navigate = useNavigate();
  const { q } = useSearch({ from: "/menu" });
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

  const filtered = useMemo(() => {
    const term = (q ?? "").trim().toLowerCase();
    return items.filter((i) => {
      const inCat = cat === "All" || i.category === cat;
      const inTerm =
        !term ||
        i.name.toLowerCase().includes(term) ||
        (i.description ?? "").toLowerCase().includes(term) ||
        i.category.toLowerCase().includes(term);
      return inCat && inTerm;
    });
  }, [items, cat, q]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-5xl md:text-6xl">Our Menu</h1>

        {q && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-border px-4 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span>Results for <strong>{q}</strong></span>
            <button onClick={() => navigate({ to: "/menu", search: {} })} aria-label="Clear search" className="rounded-full p-1 hover:bg-muted">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition ${cat === c ? "bg-accent text-accent-foreground" : "bg-white border border-border hover:bg-muted"}`}>
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-white">
                <div className="aspect-[4/3] bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-9 w-full rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-border bg-white p-10 text-center text-muted-foreground">
            Nothing matches that. Try another search or category.
          </p>
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
