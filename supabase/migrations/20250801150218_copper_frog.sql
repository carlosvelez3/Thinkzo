/*
  # Fix Recursive RLS Policies

  This migration fixes the infinite recursion error in RLS policies by removing
  self-referencing queries in the users table policies.

  ## Changes Made
  1. Remove recursive admin check from users table policies
  2. Keep simple user-specific access controls
  3. Maintain security while avoiding recursion
*/

-- Drop the problematic recursive policies on users table
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile on signup" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

-- Create non-recursive policies for users table
CREATE POLICY "Users can read their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile on signup" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- For admin access, we'll handle this at the application level
-- or create a separate function that doesn't cause recursion
-- For now, removing the recursive admin policy

-- Fix other policies that might reference users table recursively
DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can manage all CMS content" ON public.content_sections;
DROP POLICY IF EXISTS "Admins can manage all navigation" ON public.navigation_items;
DROP POLICY IF EXISTS "Admins can manage all services" ON public.services;
DROP POLICY IF EXISTS "Admins can read admin logs" ON public.admin_logs;

-- Recreate admin policies using a safer approach
-- We'll use a custom function to avoid recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create admin policies using the function
CREATE POLICY "Admins can manage contact messages" 
ON public.contact_messages 
FOR ALL 
USING (is_admin());

CREATE POLICY "Admins can manage all CMS content" 
ON public.content_sections 
FOR ALL 
USING (is_admin());

CREATE POLICY "Admins can manage all navigation" 
ON public.navigation_items 
FOR ALL 
USING (is_admin());

CREATE POLICY "Admins can manage all services" 
ON public.services 
FOR ALL 
USING (is_admin());

CREATE POLICY "Admins can read admin logs" 
ON public.admin_logs 
FOR SELECT 
USING (is_admin());