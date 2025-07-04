/*
  # Complete Database Schema for Thinkzo Website

  1. New Tables
    - `users` - User profiles with authentication data
    - `services` - Company services/products with CRUD capabilities
    - `contact_messages` - Contact form submissions
    - `admin_logs` - Activity logging for admin actions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
    - Secure admin-only operations

  3. Features
    - User authentication and role management
    - Service management with categories and features
    - Contact form with status tracking
    - Admin activity logging
    - SEO-friendly structure
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  image_url text,
  is_featured boolean DEFAULT false,
  meta_title text,
  meta_description text,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  service_type text,
  budget_range text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services policies
CREATE POLICY "Anyone can read services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update message status"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin logs policies
CREATE POLICY "Admins can read logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generate slug for services
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug = trim(both '-' from NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_service_slug
  BEFORE INSERT OR UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_title();

-- Insert sample data
INSERT INTO services (title, description, features, price, category, is_featured) VALUES
  (
    'AI-Powered Website Development',
    'Custom websites built with neural networks that adapt to user behavior and optimize performance automatically.',
    ARRAY['Neural Design System', 'Auto-Optimization', 'Smart SEO', 'Adaptive UI/UX', 'Performance Analytics'],
    4999,
    'web-development',
    true
  ),
  (
    'Intelligent Marketing Automation',
    'AI-driven marketing campaigns that predict customer behavior and optimize conversion rates in real-time.',
    ARRAY['Predictive Analytics', 'Smart Content Generation', 'Auto A/B Testing', 'Behavioral Targeting'],
    2999,
    'marketing',
    true
  ),
  (
    'Neural Brand Identity',
    'Dynamic brand systems that evolve with market trends using machine learning algorithms.',
    ARRAY['Adaptive Logos', 'Smart Color Palettes', 'AI Typography', 'Brand Evolution Tracking'],
    1999,
    'branding',
    false
  ),
  (
    'Cognitive User Experience Design',
    'UX design powered by neural networks that understand and predict user needs.',
    ARRAY['Behavioral Analysis', 'Predictive Interface', 'Smart Personalization', 'Emotion Recognition'],
    3499,
    'design',
    true
  ),
  (
    'AI-Enhanced Mobile Applications',
    'Mobile apps with built-in artificial intelligence for superior user experiences.',
    ARRAY['Smart Notifications', 'Predictive Features', 'Auto-Learning Interface', 'Neural Performance'],
    5999,
    'mobile',
    false
  ),
  (
    'Intelligent E-commerce Solutions',
    'E-commerce platforms with AI-powered recommendations and dynamic pricing.',
    ARRAY['Smart Recommendations', 'Dynamic Pricing', 'Inventory Prediction', 'Customer Insights'],
    7999,
    'ecommerce',
    true
  );

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
BEGIN
  -- This function should be called after the first admin user signs up
  -- to set their role to admin
  UPDATE users 
  SET role = 'admin' 
  WHERE email = 'admin@thinkzo.ai' 
  AND role = 'user';
END;
$$ language 'plpgsql';