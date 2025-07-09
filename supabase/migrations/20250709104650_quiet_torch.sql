/*
  # Add phone column to users table

  1. Changes
    - Add `phone` column to `users` table with proper constraints
    - Column is optional (nullable) and stores phone numbers as text

  2. Security
    - No changes to existing RLS policies needed
    - Phone column will inherit existing user policies
*/

-- Add phone column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;
END $$;