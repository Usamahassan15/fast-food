
-- Menu items (public read)
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  price_cents integer NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu public read" ON public.menu_items FOR SELECT USING (true);

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  delivery_address text NOT NULL,
  phone text NOT NULL,
  items jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders read" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own orders insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed menu
INSERT INTO public.menu_items (name, description, category, price_cents, image_url) VALUES
('Classic Pepperoni', 'Loaded pepperoni, mozzarella, tomato sauce.', 'Pizzas', 89900, null),
('Cheeziest Solo', '9" signature pizza, garlic bread, drink.', 'Deals', 89900, null),
('Family Fiesta', 'Two large pizzas, 6 wings, garlic bread, 1.5L drink.', 'Deals', 259900, null),
('Wing It Combo', 'Medium pizza + 8 buffalo wings + dip.', 'Deals', 149900, null),
('Movie Night Box', 'Medium pizza, sides, drink, dessert.', 'Deals', 179900, null),
('Buffalo Wings 8pc', 'Crispy wings tossed in buffalo sauce.', 'Wings', 69900, null),
('Garlic Bread', 'Oven-baked with garlic butter.', 'Sides', 29900, null),
('Coke 1.5L', 'Chilled bottle.', 'Drinks', 24900, null);
