/*
  # Fix User Insert RLS Policy

  1. Security Changes
    - Add policy to allow authenticated users to insert their own user record
    - This enables the sign-up flow to work properly by allowing users to create their profile
    - The policy ensures users can only insert records where the ID matches their auth.uid()

  2. Policy Details
    - Target: users table
    - Operation: INSERT
    - Condition: The user ID must match the authenticated user's ID (auth.uid())
    - This maintains security while enabling the sign-up process
*/

-- Add policy to allow users to insert their own profile during sign-up
CREATE POLICY "Users can insert own profile during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);