import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, MapPin, Search, ShoppingCart, User, Send, Bike, Store, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button className="rounded-md p-2 hover:bg-muted" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="mr-2 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground font-black">S</div>
          <span className="text-2xl font-black tracking-tight">
            Slice<span className="text-accent">&</span>Co
          </span>
        </Link>
        <div className="ml-2 hidden overflow-hidden rounded-full border border-border md:flex">
          <button className="flex items-center gap-2 bg-brand px-5 py-2 text-sm font-bold text-brand-foreground">
            <MapPin className="h-4 w-4" /> DELIVERY
          </button>
          <button className="flex items-center gap-2 bg-white px-5 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
            <Store className="h-4 w-4" /> PICK-UP
          </button>
        </div>
        <div className="ml-3 hidden flex-1 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Find in Slice & Co" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 lg:flex">
          <Send className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Enter delivery address" className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/menu" className="hidden rounded-full px-3 py-2 text-sm font-bold uppercase tracking-wider hover:bg-muted sm:inline-block">Menu</Link>
          <Link to="/cart" className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground">
            <ShoppingCart className="h-4 w-4" /> Cart
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-accent-foreground">{count}</span>
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="hidden rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted sm:inline-block">Orders</Link>
              <button onClick={signOut} className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted">
              <User className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl gap-2 px-4 pb-3 md:hidden">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground">
          <Bike className="h-4 w-4" /> DELIVERY
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-muted-foreground">
          <Store className="h-4 w-4" /> PICK-UP
        </button>
      </div>
    </header>
  );
}
