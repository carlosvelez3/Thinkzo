/*
  # Comprehensive Business Management Database Schema

  1. New Tables
    - `users` - User accounts with roles and profile information
    - `projects` - Client projects with status tracking and details
    - `subscriptions` - User subscription plans and billing
    - `usage_logs` - Track user activity and feature usage
    - `admin_logs` - Administrative actions and security events
    - `contacts` - Contact form submissions and feedback

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
    - Secure admin-only operations

  3. Features
    - Project management with status tracking
    - Subscription billing and plan management
    - Usage analytics and monitoring
    - Contact management system
    - Comprehensive audit logging
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (enhanced)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  avatar_url text,
  phone text,
  company text,
  job_title text,
  bio text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  project_type text NOT NULL CHECK (project_type IN ('website', 'mobile_app', 'branding', 'marketing', 'consulting', 'other')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled', 'on_hold')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  budget_range text,
  estimated_hours integer,
  actual_hours integer DEFAULT 0,
  start_date date,
  due_date date,
  completion_date date,
  requirements jsonb DEFAULT '{}',
  deliverables text[],
  tags text[],
  assigned_to uuid REFERENCES users(id),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  client_feedback text,
  internal_notes text,
  is_billable boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('free', 'basic', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended', 'trial')),
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time')),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  features jsonb DEFAULT '{}',
  usage_limits jsonb DEFAULT '{}',
  stripe_subscription_id text,
  stripe_customer_id text,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Usage Logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  session_id text,
  duration_ms integer,
  success boolean DEFAULT true,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Admin Logs table (enhanced)
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  severity text DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Contacts/Feedback table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  subject text,
  message text NOT NULL,
  contact_type text DEFAULT 'general' CHECK (contact_type IN ('general', 'support', 'sales', 'feedback', 'bug_report', 'feature_request')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  assigned_to uuid REFERENCES users(id),
  source text DEFAULT 'website',
  tags text[],
  attachments text[],
  response_sent boolean DEFAULT false,
  response_date timestamptz,
  satisfaction_rating integer CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  follow_up_required boolean DEFAULT false,
  follow_up_date timestamptz,
  internal_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Projects policies
CREATE POLICY "Users can read own projects" ON projects
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR 
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() OR 
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage all projects" ON projects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can read own subscriptions" ON subscriptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Usage logs policies
CREATE POLICY "Users can read own usage logs" ON usage_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert usage logs" ON usage_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all usage logs" ON usage_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Admin logs policies
CREATE POLICY "Admins can read admin logs" ON admin_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "System can insert admin logs" ON admin_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Contacts policies
CREATE POLICY "Anyone can create contacts" ON contacts
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all contacts" ON contacts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Assigned users can read their contacts" ON contacts
  FOR SELECT TO authenticated
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO users (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@thinkzo.ai', 'Admin User', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'manager@thinkzo.ai', 'Project Manager', 'manager'),
  ('00000000-0000-0000-0000-000000000003', 'user@example.com', 'John Doe', 'user')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (user_id, title, description, project_type, status, budget_range) VALUES
  ('00000000-0000-0000-0000-000000000003', 'E-commerce Website', 'Modern online store with payment integration', 'website', 'in_progress', '$5,000-$10,000'),
  ('00000000-0000-0000-0000-000000000003', 'Mobile App Development', 'iOS and Android app for fitness tracking', 'mobile_app', 'pending', '$10,000+'),
  ('00000000-0000-0000-0000-000000000003', 'Brand Identity Design', 'Complete brand package including logo and guidelines', 'branding', 'completed', '$1,000-$5,000')
ON CONFLICT DO NOTHING;

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, plan_name, plan_type, amount, current_period_start, current_period_end) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Pro Plan', 'pro', 99.00, now(), now() + interval '1 month')
ON CONFLICT DO NOTHING;