import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

type OrderItem = { id: string; name: string; qty: number; price_cents: number };

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-5xl">Your Orders</h1>
        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-white p-10 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
            <Link to="/menu" className="mt-4 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground">Order now</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((o) => {
              const items = (o.items as unknown as OrderItem[]) || [];
              return (
                <div key={o.id} className="rounded-2xl border border-border bg-white p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Order #{o.id.slice(0, 8)}</div>
                      <div className="mt-1 text-sm">{new Date(o.created_at).toLocaleString()}</div>
                    </div>
                    <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider">{o.status}</span>
                  </div>
                  <ul className="mt-3 divide-y divide-border">
                    {items.map((it, idx) => (
                      <li key={idx} className="flex justify-between py-2 text-sm">
                        <span>{it.qty}× {it.name}</span>
                        <span className="font-bold">{formatPrice(it.price_cents * it.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-border pt-3">
                    <span className="text-sm text-muted-foreground">To: {o.delivery_address}</span>
                    <span className="text-lg font-black">{formatPrice(o.total_cents)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
