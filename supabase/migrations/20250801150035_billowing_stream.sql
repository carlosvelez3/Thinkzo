/*
  # Comprehensive RLS Policies Setup

  1. Security Setup
    - Enable RLS on all tables
    - Drop existing policies for clean slate
    - Create comprehensive security policies

  2. User Access Policies
    - Users can manage their own data
    - Admins have full access to all data
    - Public access for published content

  3. Content Management
    - Public can read published content sections
    - Public can read active navigation items
    - Public can read all services
    - Admins can manage all CMS content

  4. Contact & Orders
    - Anyone can submit contact messages
    - Users can read their own orders
    - System can manage orders (server-side)

  5. Admin Features
    - Admins can read admin logs
    - System can insert admin logs
*/

-- General-purpose function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Enable RLS on all relevant tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure a clean slate
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public."' || r.tablename || '";';
  END LOOP;
END $$;

-- ========== USERS ==========
CREATE POLICY "Users can read their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile on signup" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage all users" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- ========== ORDERS ==========
CREATE POLICY "Users can read their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create and update orders" ON public.orders FOR ALL USING (true); -- Assuming server-side key for writes

-- ========== CONTACT MESSAGES ==========
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage contact messages" ON public.contact_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- ========== PROFILES & SHIPPING ==========
CREATE POLICY "Users can manage their own profiles" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own shipping addresses" ON public.shipping_addresses FOR ALL USING (auth.uid() = user_id);

-- ========== ADMIN & CMS TABLES ==========
CREATE POLICY "Public can read published content" ON public.content_sections FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active navigation" ON public.navigation_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage all CMS content" ON public.content_sections FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage all navigation" ON public.navigation_items FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage all services" ON public.services FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can read admin logs" ON public.admin_logs FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "System can insert admin logs" ON public.admin_logs FOR INSERT WITH CHECK (true);