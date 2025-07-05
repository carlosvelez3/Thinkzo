/*
  # Create orders table for Stripe payments

  1. New Tables
    - `orders`
      - `id` (text, primary key) - Order ID from our system
      - `user_id` (uuid, foreign key) - Reference to users table
      - `stripe_session_id` (text) - Stripe checkout session ID
      - `stripe_payment_intent_id` (text) - Stripe payment intent ID
      - `product_name` (text) - Name of purchased product
      - `plan_type` (text) - Type of plan (startup, smart_business, enterprise)
      - `amount` (numeric) - Amount paid in dollars
      - `currency` (text) - Currency code
      - `status` (text) - Order status
      - `customer_email` (text) - Customer email
      - `customer_name` (text) - Customer name
      - `billing_address` (jsonb) - Billing address from Stripe
      - `metadata` (jsonb) - Additional metadata
      - `created_at` (timestamptz) - Order creation time
      - `paid_at` (timestamptz) - Payment completion time
      - `failure_reason` (text) - Reason for payment failure

  2. Security
    - Enable RLS on `orders` table
    - Add policies for users to read their own orders
    - Add policies for admins to read all orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  stripe_session_id text,
  stripe_payment_intent_id text,
  product_name text NOT NULL,
  plan_type text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending',
  customer_email text,
  customer_name text,
  billing_address jsonb,
  metadata jsonb DEFAULT '{}',
  receipt_url text,
  failure_reason text,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'paid', 'failed', 'cancelled', 'refunded'));

ALTER TABLE orders ADD CONSTRAINT orders_plan_type_check 
CHECK (plan_type IN ('startup', 'smart_business', 'enterprise', 'custom'));

-- Create indexes
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_stripe_session_id_idx ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS orders_stripe_payment_intent_id_idx ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can insert orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Update trigger
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();