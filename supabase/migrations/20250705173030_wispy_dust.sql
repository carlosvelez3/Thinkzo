/*
  # Enable Row-Level Security for Users Table

  1. Security Setup
    - Enable RLS on users table
    - Drop any existing conflicting policies
    - Create new policies with unique names

  2. User Policies
    - Users can only read their own profile
    - Users can only update their own profile
    - Admins can read and manage all users

  3. Safety Features
    - Checks for existing policies before creation
    - Uses auth.uid() for secure user identification
    - Prevents SQL errors with IF EXISTS clauses
*/

-- Enable Row-Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to prevent conflicts
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
DROP POLICY IF EXISTS "user_select_own_profile_v2" ON users;
DROP POLICY IF EXISTS "user_update_own_profile_v2" ON users;
DROP POLICY IF EXISTS "admin_select_all_profiles_v2" ON users;
DROP POLICY IF EXISTS "admin_manage_all_profiles_v2" ON users;

-- Create new policies with unique names to avoid future conflicts

-- Policy 1: Users can read their own profile
CREATE POLICY "users_read_own_profile_2025"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "users_update_own_profile_2025"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy 3: Admins can read all user profiles
CREATE POLICY "admins_read_all_profiles_2025"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 4: Admins can manage all users (INSERT, UPDATE, DELETE)
CREATE POLICY "admins_manage_all_users_2025"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verify policies were created successfully
DO $$
DECLARE
  policy_count integer;
BEGIN
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename = 'users'
  AND policyname LIKE '%_2025';
  
  IF policy_count = 4 THEN
    RAISE NOTICE 'SUCCESS: All 4 RLS policies created for users table';
  ELSE
    RAISE WARNING 'WARNING: Expected 4 policies, but found %', policy_count;
  END IF;
END $$;