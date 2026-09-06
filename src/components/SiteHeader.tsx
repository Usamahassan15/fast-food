import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, MapPin, Search, ShoppingCart, User, Send, Bike, Store, LogOut, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useIsAdmin } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user } = useAuth();
  const { count } = useCart();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [open, setOpen] = useState(false);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/menu", search: { q: q || undefined } });
  };

  const toggle = (active: boolean) =>
    `flex items-center gap-2 px-5 py-2 text-sm font-bold uppercase transition ${
      active ? "bg-brand text-brand-foreground" : "bg-white text-muted-foreground hover:bg-muted"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen((o) => !o)} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link to="/" className="mr-2 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground font-black">S</div>
          <span className="text-2xl font-black tracking-tight">
            Slice<span className="text-accent">&</span>Co
          </span>
        </Link>
        <div className="ml-2 hidden overflow-hidden rounded-full border border-border md:flex">
          <button onClick={() => setMode("delivery")} className={toggle(mode === "delivery")}>
            <MapPin className="h-4 w-4" /> Delivery
          </button>
          <button onClick={() => setMode("pickup")} className={toggle(mode === "pickup")}>
            <Store className="h-4 w-4" /> Pick-up
          </button>
        </div>
        <form onSubmit={search} className="ml-3 hidden flex-1 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} type="text" placeholder="Find in Slice & Co" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </form>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 xl:flex">
          <Send className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Enter delivery address" className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/menu" className="hidden rounded-full px-3 py-2 text-sm font-bold uppercase tracking-wider hover:bg-muted sm:inline-block">Menu</Link>
          <Link to="/cart" className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground">
            <ShoppingCart className="h-4 w-4" /> Cart
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-accent-foreground">{count}</span>
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted lg:flex">
                  <ShieldCheck className="h-4 w-4" /> Admin
                </Link>
              )}
              <Link to="/orders" className="hidden rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted lg:inline-block">Orders</Link>
              <Link to="/profile" className="hidden rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted lg:inline-block">Profile</Link>
              <button onClick={signOut} className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted">
              <User className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      </div>

      {open && (
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 border-t border-border px-4 py-3 lg:hidden">
          <Link to="/menu" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider hover:bg-muted">Menu</Link>
          {user && <Link to="/orders" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider hover:bg-muted">Orders</Link>}
          {user && <Link to="/profile" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider hover:bg-muted">Profile</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider hover:bg-muted">Admin panel</Link>}
          <form onSubmit={(e) => { search(e); setOpen(false); }} className="mt-2 flex items-center gap-2 rounded-full border border-border px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the menu" className="w-full bg-transparent text-sm outline-none" />
          </form>
        </nav>
      )}

      <div className="mx-auto flex max-w-7xl gap-2 px-4 pb-3 md:hidden">
        <button onClick={() => setMode("delivery")} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${mode === "delivery" ? "bg-brand text-brand-foreground" : "border border-border bg-white text-muted-foreground"}`}>
          <Bike className="h-4 w-4" /> DELIVERY
        </button>
        <button onClick={() => setMode("pickup")} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${mode === "pickup" ? "bg-brand text-brand-foreground" : "border border-border bg-white text-muted-foreground"}`}>
          <Store className="h-4 w-4" /> PICK-UP
        </button>
      </div>
    </header>
  );
}
