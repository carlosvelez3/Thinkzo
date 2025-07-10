-- Create the moddatetime function if it doesn't exist
CREATE OR REPLACE FUNCTION moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if profiles table exists and has the expected structure
DO $$
BEGIN
    -- If profiles table doesn't exist, create it with id column (matching existing schema)
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        CREATE TABLE public.profiles (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            updated_at timestamp with time zone DEFAULT now(),
            username text UNIQUE,
            full_name text,
            avatar_url text,
            website text
        );
    END IF;
    
    -- Add additional columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN phone text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address_line1' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN address_line1 text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address_line2' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN address_line2 text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'city' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN city text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'state' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN state text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'zip_code' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN zip_code text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'country' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN country text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN stripe_customer_id text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Auto update timestamp on update (use existing updated_at column)
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

-- 4. RLS Policies: Only allow access to own data (using 'id' column for profiles)
DROP POLICY IF EXISTS "Allow individual access to profiles" ON public.profiles;
CREATE POLICY "Allow individual access to profiles"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual access to shipping addresses" ON public.shipping_addresses;
CREATE POLICY "Allow individual access to shipping addresses"
  ON public.shipping_addresses
  FOR ALL
  USING (auth.uid() = user_id);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON public.shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_is_default ON public.shipping_addresses(user_id, is_default) WHERE is_default = true;

-- 6. Add helpful comments
COMMENT ON TABLE public.profiles IS 'Extended user profile information including contact details and Stripe customer ID';
COMMENT ON TABLE public.shipping_addresses IS 'Multiple shipping addresses per user with default address support';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN public.shipping_addresses.is_default IS 'Indicates if this is the default shipping address for the user';