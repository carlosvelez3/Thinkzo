/*
  # Fix RLS policy for contact_messages table

  1. Security Updates
    - Drop existing problematic RLS policies
    - Create new policy allowing anonymous users to insert contact messages
    - Ensure admins can still manage all contact messages

  2. Changes
    - Remove existing INSERT policy that may be causing conflicts
    - Add clear, simple policy for public contact form submissions
    - Maintain admin access for managing messages
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public contact form submissions" ON contact_messages;
DROP POLICY IF EXISTS "Admins can manage contact messages" ON contact_messages;

-- Create new policy allowing anonymous users to submit contact forms
CREATE POLICY "Public can submit contact forms"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy allowing admins to manage all contact messages
CREATE POLICY "Admins can manage contact messages"
  ON contact_messages
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());