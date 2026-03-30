-- =============================================
-- ZaiWear Catalog — Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Categories
CREATE TABLE public.categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  image       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. Products
CREATE TABLE public.products (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  description    text,
  category_id    uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  image          text,
  featured       boolean NOT NULL DEFAULT false,
  featured_order integer DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- 4. Product Colors
CREATE TABLE public.product_colors (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name       text NOT NULL,
  hex        text NOT NULL,
  image      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Product Sizes
CREATE TABLE public.product_sizes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size       text NOT NULL,
  price      numeric NOT NULL,
  available  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. User Roles
CREATE TABLE public.user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 7. has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 8. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Enable RLS
ALTER TABLE public.categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles    ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies — categories
CREATE POLICY "Public can view categories"    ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories"  ON public.categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories"  ON public.categories FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories"  ON public.categories FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 11. RLS Policies — products
CREATE POLICY "Public can view products"    ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products"  ON public.products FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products"  ON public.products FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products"  ON public.products FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 12. RLS Policies — product_colors
CREATE POLICY "Public can view colors"    ON public.product_colors FOR SELECT USING (true);
CREATE POLICY "Admins can insert colors"  ON public.product_colors FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update colors"  ON public.product_colors FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete colors"  ON public.product_colors FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 13. RLS Policies — product_sizes
CREATE POLICY "Public can view sizes"    ON public.product_sizes FOR SELECT USING (true);
CREATE POLICY "Admins can insert sizes"  ON public.product_sizes FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sizes"  ON public.product_sizes FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sizes"  ON public.product_sizes FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 14. RLS Policies — user_roles
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- 15. Storage bucket (run in Storage section or via API)
-- Bucket name: product-images (public)
-- Folders: products/, product-colors/, categories/

-- 16. After running this SQL:
-- a) Go to Storage > Create bucket "product-images" (set as Public)
-- b) Create your admin user via Supabase Auth > Users > Add user
-- c) Insert their role manually:
--    INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-uuid', 'admin');
