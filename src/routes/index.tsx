import { createFileRoute } from "@tanstack/react-router";
import { Menu, MapPin, Search, ShoppingCart, User, Send, Bike, Store, Apple, Play, Facebook, Instagram, Youtube } from "lucide-react";

import heroPizza from "@/assets/hero-pizza.jpg";
import catPizza from "@/assets/cat-pizza.jpg";
import catWings from "@/assets/cat-wings.jpg";
import catSides from "@/assets/cat-sides.jpg";
import catDrinks from "@/assets/cat-drinks.jpg";
import promo1 from "@/assets/promo1.jpg";
import promo2 from "@/assets/promo2.jpg";
import promo3 from "@/assets/promo3.jpg";
import mobileApp from "@/assets/mobile-app.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const categories = [
  { name: "Pizzas", img: catPizza },
  { name: "Wings", img: catWings },
  { name: "Sides", img: catSides },
  { name: "Drinks", img: catDrinks },
  { name: "Pizzas", img: catPizza },
  { name: "Wings", img: catWings },
];

const deals = [
  {
    name: "Cheeziest Solo",
    desc: "One 9\" signature pizza, garlic bread, 345ml drink.",
    price: "Rs. 899",
    img: catPizza,
  },
  {
    name: "Family Fiesta",
    desc: "Two large pizzas, 6 wings, garlic bread, 1.5L drink.",
    price: "Rs. 2,599",
    img: promo2,
  },
  {
    name: "Wing It Combo",
    desc: "One medium pizza + 8 buffalo wings + dip.",
    price: "Rs. 1,499",
    img: catWings,
  },
  {
    name: "Movie Night Box",
    desc: "Medium pizza, sides, drink, dessert.",
    price: "Rs. 1,799",
    img: promo3,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button className="rounded-md p-2 hover:bg-muted" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>

          <a href="/" className="mr-2 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground font-black">S</div>
            <span className="text-2xl font-black tracking-tight">
              Slice<span className="text-accent">&</span>Co
            </span>
          </a>

          {/* Delivery/Pickup toggle */}
          <div className="ml-2 hidden overflow-hidden rounded-full border border-border md:flex">
            <button className="flex items-center gap-2 bg-brand px-5 py-2 text-sm font-bold text-brand-foreground">
              <MapPin className="h-4 w-4" /> DELIVERY
            </button>
            <button className="flex items-center gap-2 bg-white px-5 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
              <Store className="h-4 w-4" /> PICK-UP
            </button>
          </div>

          {/* Search */}
          <div className="ml-3 hidden flex-1 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find in Slice & Co"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Address */}
          <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 lg:flex">
            <Send className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter delivery address"
              className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground">
              <ShoppingCart className="h-4 w-4" /> Cart
              <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-accent-foreground">0</span>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-muted">
              <User className="h-4 w-4" /> Login
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="mx-auto flex max-w-7xl gap-2 px-4 pb-3 md:hidden">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground">
            <Bike className="h-4 w-4" /> DELIVERY
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-muted-foreground">
            <Store className="h-4 w-4" /> PICK-UP
          </button>
        </div>
      </header>

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-brand">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
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
              <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:opacity-90">
                Order now
              </button>
              <button className="rounded-full border-2 border-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink hover:bg-ink hover:text-white">
                View menu
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-white/30 blur-2xl" />
            <img
              src={heroPizza}
              alt="Fresh pepperoni pizza"
              width={1600}
              height={900}
              className="relative aspect-square w-full rounded-full object-cover shadow-2xl"
            />
          </div>
        </div>
        {/* Marquee */}
        <div className="border-y-4 border-ink bg-accent text-white">
          <div className="flex whitespace-nowrap marquee-track py-3 text-2xl font-black uppercase tracking-widest">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-8 pr-8">
                <span>🍕 Free delivery over Rs. 1500</span>
                <span>•</span>
                <span>🔥 Buy 1 Get 1 every Tuesday</span>
                <span>•</span>
                <span>🧀 New: Cheese-stuffed crust</span>
                <span>•</span>
                <span>🚴 30-min or free</span>
                <span>•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore menu */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-4xl md:text-5xl">Explore Menu</h2>
          <a href="#" className="text-sm font-bold uppercase tracking-widest text-accent hover:underline">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c, i) => (
            <a
              key={i}
              href="#"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-1 hover:border-accent hover:shadow-lg"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">{c.name}</span>
            </a>
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
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1200}
                  height={512}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-2xl leading-tight">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-4xl md:text-5xl">Hot Deals</h2>
          <a href="#" className="text-sm font-bold uppercase tracking-widest text-accent hover:underline">
            All deals →
          </a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((d) => (
            <article
              key={d.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={d.img}
                  alt={d.name}
                  loading="lazy"
                  width={600}
                  height={450}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                  Deal
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-2xl">{d.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{d.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-ink">{d.price}</span>
                  <button className="rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-foreground hover:bg-accent hover:text-accent-foreground">
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
          <img
            src={mobileApp}
            alt="Slice & Co mobile app"
            loading="lazy"
            width={1200}
            height={900}
            className="w-full rounded-2xl object-cover"
          />
          <div>
            <h2 className="text-4xl md:text-5xl leading-tight">Download our mobile app</h2>
            <p className="mt-3 max-w-md text-ink/80">
              Elevate your experience by downloading our mobile app for a seamless ordering experience,
              exclusive app-only deals, and real-time delivery tracking.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-white hover:opacity-90">
                <Play className="h-6 w-6" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase opacity-70">Get it on</div>
                  <div className="text-base font-bold">Google Play</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-white hover:opacity-90">
                <Apple className="h-6 w-6" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase opacity-70">Download on</div>
                  <div className="text-base font-bold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent font-black">S</div>
              <span className="text-2xl font-black">Slice<span className="text-accent">&</span>Co</span>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Hot pizza, real cheese, delivered fast — all across town, seven days a week.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg text-brand">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white">Menu</a></li>
              <li><a href="#" className="hover:text-white">Deals</a></li>
              <li><a href="#" className="hover:text-white">Track order</a></li>
              <li><a href="#" className="hover:text-white">Locations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg text-brand">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Franchise</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg text-brand">Get updates</h4>
            <p className="mt-4 text-sm text-white/70">Cheesy deals in your inbox, no spam.</p>
            <form className="mt-3 flex overflow-hidden rounded-full bg-white/10">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-white/50"
              />
              <button className="bg-accent px-4 text-sm font-bold uppercase tracking-wider hover:opacity-90">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Slice & Co. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
