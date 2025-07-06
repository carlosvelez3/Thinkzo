/*
  # Enhanced Database Schema Migration
  
  This migration adds new tables and enhances existing ones while avoiding conflicts:
  1. Projects - Project management system
  2. Subscriptions - User subscription management  
  3. Usage Logs - System usage tracking
  4. Contacts - Enhanced contact/feedback system
  5. Enhanced Users table with additional fields
  6. Performance indexes and security policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add new columns to existing users table if they don't exist
DO $$
BEGIN
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;

  -- Add company column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'company'
  ) THEN
    ALTER TABLE users ADD COLUMN company text;
  END IF;

  -- Add job_title column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'job_title'
  ) THEN
    ALTER TABLE users ADD COLUMN job_title text;
  END IF;

  -- Add bio column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio text;
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE users ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add last_login column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login timestamptz;
  END IF;

  -- Add email_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN email_verified boolean DEFAULT false;
  END IF;
END $$;

-- Update users role constraint to include manager if not already present
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_role_check' AND table_name = 'users'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
  END IF;
  
  -- Add new constraint with manager role
  ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('user', 'admin', 'manager'));
END $$;

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

-- Enhanced Contacts table (rename from contact_messages if needed)
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

-- Create performance indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON usage_logs(action);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_type ON contacts(contact_type);

-- Enable Row Level Security on new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables only (avoid conflicts with existing policies)

-- Projects policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can read own projects'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can create projects'
  ) THEN
    CREATE POLICY "Users can create projects" ON projects
      FOR INSERT TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can update own projects'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Admins can manage all projects'
  ) THEN
    CREATE POLICY "Admins can manage all projects" ON projects
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      );
  END IF;
END $$;

-- Subscriptions policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can read own subscriptions'
  ) THEN
    CREATE POLICY "Users can read own subscriptions" ON subscriptions
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Admins can manage all subscriptions'
  ) THEN
    CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      );
  END IF;
END $$;

-- Usage logs policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'usage_logs' AND policyname = 'Users can read own usage logs'
  ) THEN
    CREATE POLICY "Users can read own usage logs" ON usage_logs
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'usage_logs' AND policyname = 'System can insert usage logs'
  ) THEN
    CREATE POLICY "System can insert usage logs" ON usage_logs
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'usage_logs' AND policyname = 'Admins can read all usage logs'
  ) THEN
    CREATE POLICY "Admins can read all usage logs" ON usage_logs
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      );
  END IF;
END $$;

-- Contacts policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Anyone can create contacts'
  ) THEN
    CREATE POLICY "Anyone can create contacts" ON contacts
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Admins can manage all contacts'
  ) THEN
    CREATE POLICY "Admins can manage all contacts" ON contacts
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Assigned users can read their contacts'
  ) THEN
    CREATE POLICY "Assigned users can read their contacts" ON contacts
      FOR SELECT TO authenticated
      USING (
        assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      );
  END IF;
END $$;

-- Create updated_at triggers for new tables
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample development data (only if tables are empty)
DO $$
BEGIN
  -- Insert sample projects if none exist
  IF NOT EXISTS (SELECT 1 FROM projects LIMIT 1) THEN
    INSERT INTO projects (user_id, title, description, project_type, status, budget_range) VALUES
      ((SELECT id FROM users WHERE email = 'user@example.com' LIMIT 1), 'E-commerce Website', 'Modern online store with payment integration', 'website', 'in_progress', '$5,000-$10,000'),
      ((SELECT id FROM users WHERE email = 'user@example.com' LIMIT 1), 'Mobile App Development', 'iOS and Android app for fitness tracking', 'mobile_app', 'pending', '$10,000+'),
      ((SELECT id FROM users WHERE email = 'user@example.com' LIMIT 1), 'Brand Identity Design', 'Complete brand package including logo and guidelines', 'branding', 'completed', '$1,000-$5,000');
  END IF;

  -- Insert sample subscriptions if none exist
  IF NOT EXISTS (SELECT 1 FROM subscriptions LIMIT 1) THEN
    INSERT INTO subscriptions (user_id, plan_name, plan_type, amount, current_period_start, current_period_end) VALUES
      ((SELECT id FROM users WHERE email = 'user@example.com' LIMIT 1), 'Pro Plan', 'pro', 99.00, now(), now() + interval '1 month');
  END IF;
END $$;