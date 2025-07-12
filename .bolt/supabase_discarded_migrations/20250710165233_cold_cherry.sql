/*
  # Add Profiles and Shipping Addresses Tables

  1. New Tables
    - `profiles` - Extended user profile with contact and address information
    - `shipping_addresses` - Multiple shipping addresses per user with default support
  
  2. Security
    - Enable RLS on both tables
    - Add policies for users to access only their own data
  
  3. Performance
    - Add indexes on frequently queried columns
    - Composite index for efficient default address lookups
*/

-- Create the moddatetime function if it doesn't exist
CREATE OR REPLACE FUNCTION moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Profiles Table (extended user profile)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  country text,
  stripe_customer_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Auto update timestamp on update
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime();

-- 2. Shipping Addresses (supporting multiple per user)
CREATE TABLE IF NOT EXISTS public.shipping_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  label text, -- e.g. "Home", "Office"
  recipient_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  country text,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Only allow access to own data
DROP POLICY IF EXISTS "Allow individual access to profiles" ON public.profiles;
CREATE POLICY "Allow individual access to profiles"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = profiles.user_id);

DROP POLICY IF EXISTS "Allow individual access to shipping addresses" ON public.shipping_addresses;
CREATE POLICY "Allow individual access to shipping addresses"
  ON public.shipping_addresses
  FOR ALL
  USING (auth.uid() = shipping_addresses.user_id);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON public.shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_is_default ON public.shipping_addresses(user_id, is_default) WHERE is_default = true;

-- 6. Add helpful comments
COMMENT ON TABLE public.profiles IS 'Extended user profile information including contact details and Stripe customer ID';
COMMENT ON TABLE public.shipping_addresses IS 'Multiple shipping addresses per user with default address support';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN public.shipping_addresses.is_default IS 'Indicates if this is the default shipping address for the user';