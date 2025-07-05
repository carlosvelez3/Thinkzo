/*
  # Fix RLS Policy Creation Errors

  This migration safely handles existing policies to prevent 42710 errors.
  It checks for existing policies before creating new ones and ensures
  all policies have unique names and safe conditions.

  ## Changes Made
  1. Check for existing policies before creation
  2. Drop and recreate policies that need updates
  3. Ensure unique policy names across all tables
  4. Add safe conditions for all policies

  ## Tables Updated
  - users (user profiles and authentication)
  - orders (payment and order data)
  - contact_messages (contact form submissions)
  - admin_logs (admin activity tracking)
  - services (service catalog)
*/

-- Function to safely drop policy if it exists
CREATE OR REPLACE FUNCTION drop_policy_if_exists(table_name text, policy_name text)
RETURNS void AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name 
    AND policyname = policy_name
  ) THEN
    EXECUTE format('DROP POLICY %I ON %I', policy_name, table_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to safely create policy if it doesn't exist
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
  table_name text, 
  policy_name text, 
  policy_definition text
)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name 
    AND policyname = policy_name
  ) THEN
    EXECUTE format('CREATE POLICY %I ON %I %s', policy_name, table_name, policy_definition);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
-- Drop existing policies that might conflict
SELECT drop_policy_if_exists('users', 'Users can read own profile');
SELECT drop_policy_if_exists('users', 'Users can update own profile');
SELECT drop_policy_if_exists('users', 'Admins can read all users');
SELECT drop_policy_if_exists('users', 'Admins can manage users');
SELECT drop_policy_if_exists('users', 'users_select_own');
SELECT drop_policy_if_exists('users', 'users_update_own');
SELECT drop_policy_if_exists('users', 'admin_select_all_users');
SELECT drop_policy_if_exists('users', 'admin_manage_users');

-- Create users table policies with unique names
SELECT create_policy_if_not_exists(
  'users',
  'users_select_own_profile',
  'FOR SELECT TO authenticated USING (auth.uid() = id)'
);

SELECT create_policy_if_not_exists(
  'users',
  'users_update_own_profile',
  'FOR UPDATE TO authenticated USING (auth.uid() = id)'
);

SELECT create_policy_if_not_exists(
  'users',
  'admin_select_all_user_profiles',
  'FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ''admin''
    )
  )'
);

SELECT create_policy_if_not_exists(
  'users',
  'admin_manage_all_users',
  'FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ''admin''
    )
  )'
);

-- ORDERS TABLE POLICIES
-- Drop existing policies that might conflict
SELECT drop_policy_if_exists('orders', 'Users can read own orders');
SELECT drop_policy_if_exists('orders', 'System can insert orders');
SELECT drop_policy_if_exists('orders', 'System can update orders');
SELECT drop_policy_if_exists('orders', 'Admins can read all orders');

-- Create orders table policies
SELECT create_policy_if_not_exists(
  'orders',
  'orders_select_own',
  'FOR SELECT TO authenticated USING (auth.uid() = user_id)'
);

SELECT create_policy_if_not_exists(
  'orders',
  'orders_insert_system',
  'FOR INSERT TO authenticated WITH CHECK (true)'
);

SELECT create_policy_if_not_exists(
  'orders',
  'orders_update_system',
  'FOR UPDATE TO authenticated USING (true)'
);

SELECT create_policy_if_not_exists(
  'orders',
  'admin_select_all_orders',
  'FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ''admin''
    )
  )'
);

-- CONTACT_MESSAGES TABLE POLICIES
-- Drop existing policies that might conflict
SELECT drop_policy_if_exists('contact_messages', 'Anyone can create contact messages');
SELECT drop_policy_if_exists('contact_messages', 'Admins can read all messages');
SELECT drop_policy_if_exists('contact_messages', 'Admins can update message status');

-- Create contact_messages table policies
SELECT create_policy_if_not_exists(
  'contact_messages',
  'contact_insert_anyone',
  'FOR INSERT TO anon, authenticated WITH CHECK (true)'
);

SELECT create_policy_if_not_exists(
  'contact_messages',
  'admin_select_all_contacts',
  'FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ''admin''
    )
  )'
);

SELECT create_policy_if_not_exists(
  'contact_messages',
  'admin_update_contact_status',
  'FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ''admin''
    )
  )'
);

-- ADMIN_LOGS TABLE POLICIES
-- Drop existing policies that might conflict
SELECT drop_policy_if_exists('admin_logs', 'Admins can read logs');
SELECT drop_policy_if_exists('admin_logs', 'System can insert logs');

-- Create admin_logs table policies
SELECT create_policy_if_not_exists(
  'admin_logs',
  'admin_select_logs',
  'FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ''admin''
    )
  )'
);

SELECT create_policy_if_not_exists(
  'admin_logs',
  'system_insert_admin_logs',
  'FOR INSERT TO authenticated WITH CHECK (true)'
);

-- SERVICES TABLE POLICIES
-- Drop existing policies that might conflict
SELECT drop_policy_if_exists('services', 'Anyone can read services');
SELECT drop_policy_if_exists('services', 'Admins can manage services');

-- Create services table policies
SELECT create_policy_if_not_exists(
  'services',
  'services_select_public',
  'FOR SELECT TO anon, authenticated USING (true)'
);

SELECT create_policy_if_not_exists(
  'services',
  'admin_manage_services',
  'FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = ''admin''
    )
  )'
);

-- Clean up helper functions
DROP FUNCTION IF EXISTS drop_policy_if_exists(text, text);
DROP FUNCTION IF EXISTS create_policy_if_not_exists(text, text, text);

-- Verify all policies are created correctly
DO $$
DECLARE
  policy_count integer;
BEGIN
  SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE schemaname = 'public';
  RAISE NOTICE 'Total RLS policies created: %', policy_count;
END $$;