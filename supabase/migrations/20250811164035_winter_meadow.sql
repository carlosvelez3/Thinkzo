/*
  # Fix contact messages RLS policy

  1. Security Updates
    - Update RLS policy to allow anonymous users to insert contact messages
    - Ensure public contact form submissions work properly
    
  2. Changes
    - Modify existing INSERT policy to allow both anon and authenticated users
    - Keep existing admin management policy intact
*/

-- Drop the existing restrictive INSERT policy if it exists
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_messages;

-- Create a new policy that allows both anonymous and authenticated users to insert
CREATE POLICY "Allow public contact form submissions"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing admin policy remains intact
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Admins can manage contact messages'
  ) THEN
    CREATE POLICY "Admins can manage contact messages"
      ON contact_messages
      FOR ALL
      TO authenticated
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;
END $$;