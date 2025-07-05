/*
  # Fix Users Table RLS Policies

  1. Security
    - Enable RLS on users table
    - Drop any existing conflicting policies
    - Create clean, unique policies for user access
    - Ensure admins can manage all users
    - Users can only access their own data

  2. Changes
    - Safe policy creation with IF EXISTS checks
    - Unique policy names to avoid conflicts
    - Proper authentication checks
*/

-- Enable Row-Level Security (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- DROP ALL EXISTING POLICIES to start clean
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "admin_select_all_users" ON users;
DROP POLICY IF EXISTS "admin_manage_users" ON users;
DROP POLICY IF EXISTS "users_select_own_profile" ON users;
DROP POLICY IF EXISTS "users_update_own_profile" ON users;
DROP POLICY IF EXISTS "admin_select_all_user_profiles" ON users;
DROP POLICY IF EXISTS "admin_manage_all_users" ON users;

-- CREATE NEW POLICIES with unique names

-- Users can read their own profile
CREATE POLICY "user_select_own_profile_v2"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "user_update_own_profile_v2"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Admins can read all user profiles
CREATE POLICY "admin_select_all_profiles_v2"
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
CREATE POLICY "admin_manage_all_profiles_v2"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Also fix other tables while we're at it
-- ORDERS TABLE
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "System can insert orders" ON orders;
DROP POLICY IF EXISTS "System can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;

CREATE POLICY "user_select_own_orders_v2"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "system_insert_orders_v2"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "system_update_orders_v2"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "admin_select_all_orders_v2"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CONTACT_MESSAGES TABLE
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can read all messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update message status" ON contact_messages;

CREATE POLICY "public_insert_contacts_v2"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admin_select_all_contacts_v2"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "admin_update_contact_status_v2"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SERVICES TABLE
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;

CREATE POLICY "public_select_services_v2"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_manage_services_v2"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ADMIN_LOGS TABLE
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read logs" ON admin_logs;
DROP POLICY IF EXISTS "System can insert logs" ON admin_logs;

CREATE POLICY "admin_select_logs_v2"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "system_insert_admin_logs_v2"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);