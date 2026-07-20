import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);

  const placeOrder = async () => {
    if (!user) { navigate({ to: "/auth", search: { next: "/cart" } as never }); return; }
    if (!address || !phone) { toast.error("Address and phone required"); return; }
    if (items.length === 0) return;
    setPlacing(true);
    const { error, data } = await supabase.from("orders").insert({
      user_id: user.id,
      total_cents: total,
      delivery_address: address,
      phone,
      items: items,
    }).select().single();
    setPlacing(false);
    if (error) { toast.error(error.message); return; }
    clear();
    toast.success("Order placed!");
    navigate({ to: "/orders" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-5xl">Your Cart</h1>
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-white p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/menu" className="mt-4 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground">Browse menu</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {it.image_url ? <img src={it.image_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-2xl">🍕</div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{it.name}</div>
                    <div className="text-sm text-muted-foreground">{formatPrice(it.price_cents)}</div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-border">
                    <button onClick={() => setQty(it.id, it.qty - 1)} className="p-2"><Minus className="h-4 w-4" /></button>
                    <span className="w-6 text-center font-bold">{it.qty}</span>
                    <button onClick={() => setQty(it.id, it.qty + 1)} className="p-2"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="w-24 text-right font-black">{formatPrice(it.price_cents * it.qty)}</div>
                  <button onClick={() => remove(it.id)} className="p-2 text-muted-foreground hover:text-accent"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-2xl border border-border bg-white p-6">
              <h3 className="text-2xl">Checkout</h3>
              <div className="mt-4 space-y-3">
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black">{formatPrice(total)}</span>
              </div>
              <button disabled={placing} onClick={placeOrder} className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90 disabled:opacity-50">
                {placing ? "Placing…" : user ? "Place order" : "Sign in to order"}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
