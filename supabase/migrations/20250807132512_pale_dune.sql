/*
  # Fix RLS policy for contact_messages table

  1. Security Changes
    - Update RLS policy to allow anonymous users to insert contact messages
    - Ensure public users can submit contact forms without authentication
    - Maintain existing admin access for reading and managing messages

  2. Changes Made
    - Drop existing restrictive INSERT policy if it exists
    - Create new policy allowing anonymous users to insert contact messages
    - Keep existing policies for admin management intact
*/

-- Drop existing INSERT policy that might be too restrictive
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;

-- Create a new policy that explicitly allows anonymous users to insert contact messages
CREATE POLICY "Allow anonymous contact form submissions"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing admin policy for managing messages is still in place
-- (This should already exist based on the schema, but we'll recreate it to be safe)
DROP POLICY IF EXISTS "Admins can manage contact messages" ON contact_messages;

CREATE POLICY "Admins can manage contact messages"
  ON contact_messages
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());