/*
  # Add job_title column to users table

  1. Schema Changes
    - Add `job_title` column to `users` table
    - Column is optional (nullable) text field
    - Add comment for documentation

  2. Security
    - No RLS changes needed as existing policies will cover the new column
*/

-- Add job_title column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'job_title'
  ) THEN
    ALTER TABLE public.users ADD COLUMN job_title text;
    COMMENT ON COLUMN public.users.job_title IS 'Job title or position of the user';
  END IF;
END $$;