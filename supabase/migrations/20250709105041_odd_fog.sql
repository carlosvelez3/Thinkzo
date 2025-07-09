/*
  # Add Missing Columns to Users Table

  1. Updates
    - Add missing columns to users table if they don't exist
    - Ensures all required columns are present for user registration

  2. Changes
    - Add phone column if missing
    - Add company column if missing
    - Add job_title column if missing
    - Add bio column if missing
*/

-- Add missing columns to users table
DO $$
BEGIN
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone' AND table_schema = 'public'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;

  -- Add company column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'company' AND table_schema = 'public'
  ) THEN
    ALTER TABLE users ADD COLUMN company text;
  END IF;

  -- Add job_title column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'job_title' AND table_schema = 'public'
  ) THEN
    ALTER TABLE users ADD COLUMN job_title text;
    COMMENT ON COLUMN users.job_title IS 'Job title or position of the user';
  END IF;

  -- Add bio column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bio' AND table_schema = 'public'
  ) THEN
    ALTER TABLE users ADD COLUMN bio text;
  END IF;
END $$;