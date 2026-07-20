import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Play, Facebook, Instagram, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSlider3D } from "@/components/HeroSlider3D";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

import catPizza from "@/assets/cat-pizza.jpg";
import catWings from "@/assets/cat-wings.jpg";
import catSides from "@/assets/cat-sides.jpg";
import catDrinks from "@/assets/cat-drinks.jpg";
import promo1 from "@/assets/promo1.jpg";
import promo2 from "@/assets/promo2.jpg";
import promo3 from "@/assets/promo3.jpg";
import mobileApp from "@/assets/mobile-app.jpg";

export const Route = createFileRoute("/")({ component: Home });

const categories = [
  { name: "Pizzas", img: catPizza },
  { name: "Wings", img: catWings },
  { name: "Sides", img: catSides },
  { name: "Drinks", img: catDrinks },
  { name: "Deals", img: promo2 },
  { name: "Combos", img: promo3 },
];

function Home() {
  const { add } = useCart();
  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").eq("category", "Deals").limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero with 3D slider background */}
      <section className="relative overflow-hidden bg-brand">
        <HeroSlider3D />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand via-brand/70 to-transparent md:from-brand md:via-brand/60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="relative z-10">
            <div className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              Fresh out the oven
            </div>
            <h1 className="text-5xl leading-[0.9] text-ink md:text-7xl">
              Hot pizza,<br />
              <span className="text-accent">delivered</span><br />
              in a flash.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink/80">
              Hand-stretched dough, real mozzarella, fire-baked in minutes. Order now and taste the difference.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:opacity-90">
                Order now
              </Link>
              <Link to="/menu" className="rounded-full border-2 border-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink hover:bg-ink hover:text-white">
                View menu
              </Link>
            </div>
          </div>
          <div className="hidden md:block" />
        </div>
        <div className="border-y-4 border-ink bg-accent text-white">
          <div className="flex whitespace-nowrap marquee-track py-3 text-2xl font-black uppercase tracking-widest">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-8 pr-8">
                <span>🍕 Free delivery over Rs. 1500</span><span>•</span>
                <span>🔥 Buy 1 Get 1 every Tuesday</span><span>•</span>
                <span>🧀 New: Cheese-stuffed crust</span><span>•</span>
                <span>🚴 30-min or free</span><span>•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore menu */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-4xl md:text-5xl">Explore Menu</h2>
          <Link to="/menu" className="text-sm font-bold uppercase tracking-widest text-accent hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c, i) => (
            <Link key={i} to="/menu" className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-1 hover:border-accent hover:shadow-lg">
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
                <img src={c.img} alt={c.name} loading="lazy" width={600} height={600} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo tiles */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { img: promo1, title: "Delivering cheesy khushiyan" },
            { img: promo2, title: "Fastest growing brand of the year" },
            { img: promo3, title: "Made with fresh, local ingredients" },
          ].map((p, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-border bg-white">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" width={1200} height={512} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-5"><h3 className="text-2xl leading-tight">{p.title}</h3></div>
            </div>
          ))}
        </div>
      </section>

      {/* Deals from DB */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-4xl md:text-5xl">Hot Deals</h2>
          <Link to="/menu" className="text-sm font-bold uppercase tracking-widest text-accent hover:underline">All deals →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((d) => (
            <article key={d.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={d.image_url || promo2} alt={d.name} loading="lazy" width={600} height={450} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">Deal</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-2xl">{d.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{d.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-ink">{formatPrice(d.price_cents)}</span>
                  <button
                    onClick={() => add({ id: d.id, name: d.name, price_cents: d.price_cents, image_url: d.image_url })}
                    className="rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-foreground hover:bg-accent hover:text-accent-foreground">
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Mobile app */}
      <section className="bg-brand">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2">
          <img src={mobileApp} alt="Slice & Co mobile app" loading="lazy" width={1200} height={900} className="w-full rounded-2xl object-cover" />
          <div>
            <h2 className="text-4xl md:text-5xl leading-tight">Download our mobile app</h2>
            <p className="mt-3 max-w-md text-ink/80">Exclusive app-only deals, real-time delivery tracking, one-tap reorders.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-white hover:opacity-90">
                <Play className="h-6 w-6" />
                <div className="text-left leading-tight"><div className="text-[10px] uppercase opacity-70">Get it on</div><div className="text-base font-bold">Google Play</div></div>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-white hover:opacity-90">
                <Apple className="h-6 w-6" />
                <div className="text-left leading-tight"><div className="text-[10px] uppercase opacity-70">Download on</div><div className="text-base font-bold">App Store</div></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent font-black">S</div>
              <span className="text-2xl font-black">Slice<span className="text-accent">&</span>Co</span>
            </div>
            <p className="mt-4 text-sm text-white/70">Hot pizza, real cheese, delivered fast.</p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg text-brand">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
              <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg text-brand">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg text-brand">Get updates</h4>
            <p className="mt-4 text-sm text-white/70">Cheesy deals in your inbox, no spam.</p>
            <form className="mt-3 flex overflow-hidden rounded-full bg-white/10">
              <input type="email" placeholder="your@email.com" className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-white/50" />
              <button className="bg-accent px-4 text-sm font-bold uppercase tracking-wider hover:opacity-90">Join</button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">© {new Date().getFullYear()} Slice & Co. All rights reserved.</div>
      </footer>
    </div>
  );
}
