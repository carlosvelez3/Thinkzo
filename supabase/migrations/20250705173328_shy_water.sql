/*
  # Fix RLS Policy Conflicts - Final Solution

  This migration completely cleans up all existing policies and creates new ones
  with guaranteed unique names to prevent any future conflicts.
*/

-- First, let's completely disable RLS temporarily to clean everything up
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services DISABLE ROW LEVEL SECURITY;

-- Function to safely drop all policies from a table
CREATE OR REPLACE FUNCTION drop_all_policies_from_table(table_name text)
RETURNS void AS $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, table_name);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Drop ALL existing policies from all tables
SELECT drop_all_policies_from_table('users');
SELECT drop_all_policies_from_table('orders');
SELECT drop_all_policies_from_table('contact_messages');
SELECT drop_all_policies_from_table('admin_logs');
SELECT drop_all_policies_from_table('services');

-- Clean up the helper function
DROP FUNCTION drop_all_policies_from_table(text);

-- Now re-enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "users_select_own_jan2025"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own_jan2025"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Admins can read all user profiles
CREATE POLICY "admins_select_all_jan2025"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage all users (INSERT, UPDATE, DELETE)
CREATE POLICY "admins_manage_all_jan2025"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================

-- Users can read their own orders
CREATE POLICY "orders_select_own_jan2025"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System can insert orders
CREATE POLICY "orders_insert_system_jan2025"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- System can update orders
CREATE POLICY "orders_update_system_jan2025"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Admins can read all orders
CREATE POLICY "orders_admin_all_jan2025"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- CONTACT_MESSAGES TABLE POLICIES
-- ============================================================================

-- Anyone can create contact messages
CREATE POLICY "contacts_insert_public_jan2025"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can read all messages
CREATE POLICY "contacts_admin_select_jan2025"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update message status
CREATE POLICY "contacts_admin_update_jan2025"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- SERVICES TABLE POLICIES
-- ============================================================================

-- Anyone can read services
CREATE POLICY "services_select_public_jan2025"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can manage services
CREATE POLICY "services_admin_manage_jan2025"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- ADMIN_LOGS TABLE POLICIES
-- ============================================================================

-- Admins can read logs
CREATE POLICY "admin_logs_select_jan2025"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System can insert logs
CREATE POLICY "admin_logs_insert_jan2025"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all policies were created successfully
DO $$
DECLARE
  users_count integer;
  orders_count integer;
  contacts_count integer;
  services_count integer;
  logs_count integer;
  total_count integer;
BEGIN
  -- Count policies for each table
  SELECT COUNT(*) INTO users_count FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'users' AND policyname LIKE '%jan2025';
  
  SELECT COUNT(*) INTO orders_count FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'orders' AND policyname LIKE '%jan2025';
  
  SELECT COUNT(*) INTO contacts_count FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname LIKE '%jan2025';
  
  SELECT COUNT(*) INTO services_count FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'services' AND policyname LIKE '%jan2025';
  
  SELECT COUNT(*) INTO logs_count FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'admin_logs' AND policyname LIKE '%jan2025';
  
  total_count := users_count + orders_count + contacts_count + services_count + logs_count;
  
  RAISE NOTICE '=== RLS POLICY VERIFICATION ===';
  RAISE NOTICE 'Users table policies: %', users_count;
  RAISE NOTICE 'Orders table policies: %', orders_count;
  RAISE NOTICE 'Contact messages policies: %', contacts_count;
  RAISE NOTICE 'Services table policies: %', services_count;
  RAISE NOTICE 'Admin logs policies: %', logs_count;
  RAISE NOTICE 'Total policies created: %', total_count;
  
  IF total_count >= 14 THEN
    RAISE NOTICE '✅ SUCCESS: All RLS policies created successfully!';
  ELSE
    RAISE WARNING '⚠️  WARNING: Expected at least 14 policies, found %', total_count;
  END IF;
END $$;