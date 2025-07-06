/*
  # Clean RLS Setup - Final Migration
  
  This migration completely cleans up all existing RLS policies and creates
  a fresh, conflict-free set of policies for all tables.
  
  1. Security
    - Temporarily disable RLS to clean up
    - Drop ALL existing policies from all tables
    - Create new policies with unique names
    - Re-enable RLS with proper policies
  
  2. Tables Covered
    - users (4 policies)
    - orders (4 policies) 
    - contact_messages (3 policies)
    - services (2 policies)
    - admin_logs (2 policies)
*/

-- ============================================================================
-- STEP 1: COMPLETE CLEANUP
-- ============================================================================

-- Temporarily disable RLS on all tables for cleanup
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services DISABLE ROW LEVEL SECURITY;

-- Function to drop all policies from any table
CREATE OR REPLACE FUNCTION cleanup_all_policies(target_table text)
RETURNS integer AS $$
DECLARE
  policy_record RECORD;
  dropped_count integer := 0;
BEGIN
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = target_table
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, target_table);
    dropped_count := dropped_count + 1;
  END LOOP;
  
  RETURN dropped_count;
END;
$$ LANGUAGE plpgsql;

-- Clean up all existing policies
DO $$
DECLARE
  total_dropped integer := 0;
BEGIN
  total_dropped := total_dropped + cleanup_all_policies('users');
  total_dropped := total_dropped + cleanup_all_policies('orders');
  total_dropped := total_dropped + cleanup_all_policies('contact_messages');
  total_dropped := total_dropped + cleanup_all_policies('admin_logs');
  total_dropped := total_dropped + cleanup_all_policies('services');
  
  RAISE NOTICE 'Cleanup complete: % old policies removed', total_dropped;
END $$;

-- Remove cleanup function
DROP FUNCTION cleanup_all_policies(text);

-- ============================================================================
-- STEP 2: RE-ENABLE RLS
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: CREATE FRESH POLICIES (UNIQUE NAMES)
-- ============================================================================

-- USERS TABLE (4 policies)
CREATE POLICY "users_read_own_2025_final"
  ON users FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_2025_final"
  ON users FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "admin_read_all_users_2025_final"
  ON users FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "admin_manage_all_users_2025_final"
  ON users FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ORDERS TABLE (4 policies)
CREATE POLICY "users_read_own_orders_2025_final"
  ON orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "system_create_orders_2025_final"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "system_update_orders_2025_final"
  ON orders FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "admin_manage_orders_2025_final"
  ON orders FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- CONTACT_MESSAGES TABLE (3 policies)
CREATE POLICY "public_create_contacts_2025_final"
  ON contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admin_read_contacts_2025_final"
  ON contact_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "admin_update_contacts_2025_final"
  ON contact_messages FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- SERVICES TABLE (2 policies)
CREATE POLICY "public_read_services_2025_final"
  ON services FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admin_manage_services_2025_final"
  ON services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ADMIN_LOGS TABLE (2 policies)
CREATE POLICY "admin_read_logs_2025_final"
  ON admin_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "system_create_logs_2025_final"
  ON admin_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- STEP 4: VERIFICATION
-- ============================================================================

DO $$
DECLARE
  policy_counts RECORD;
  total_policies integer := 0;
BEGIN
  -- Count policies per table
  SELECT 
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname LIKE '%2025_final') as users_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname LIKE '%2025_final') as orders_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname LIKE '%2025_final') as contacts_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services' AND policyname LIKE '%2025_final') as services_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_logs' AND policyname LIKE '%2025_final') as logs_policies
  INTO policy_counts;
  
  total_policies := policy_counts.users_policies + policy_counts.orders_policies + 
                   policy_counts.contacts_policies + policy_counts.services_policies + 
                   policy_counts.logs_policies;
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'RLS POLICY VERIFICATION COMPLETE';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Users table: % policies', policy_counts.users_policies;
  RAISE NOTICE 'Orders table: % policies', policy_counts.orders_policies;
  RAISE NOTICE 'Contact messages: % policies', policy_counts.contacts_policies;
  RAISE NOTICE 'Services table: % policies', policy_counts.services_policies;
  RAISE NOTICE 'Admin logs: % policies', policy_counts.logs_policies;
  RAISE NOTICE '------------------------------------------';
  RAISE NOTICE 'TOTAL POLICIES: %', total_policies;
  
  IF total_policies = 15 THEN
    RAISE NOTICE '✅ SUCCESS: All policies created correctly!';
  ELSE
    RAISE WARNING '⚠️  Expected 15 policies, found %', total_policies;
  END IF;
  RAISE NOTICE '==========================================';
END $$;