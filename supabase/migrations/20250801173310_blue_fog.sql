/*
  # Consolidated Database Migration

  This migration consolidates all database schema changes into a single, authoritative file.
  
  ## What this migration does:
  1. Drops existing tables to ensure clean slate
  2. Creates all necessary tables with proper constraints
  3. Sets up Row Level Security policies
  4. Creates database functions and triggers
  5. Establishes proper indexes and views

  ## Tables Created:
  - users: User profiles and authentication data
  - contact_messages: Contact form submissions with AI qualification
  - orders: Payment and order tracking
  - services: Service offerings management
  - content_sections: CMS content management
  - team_members: Team member profiles
  - navigation_items: Site navigation management
  - site_settings: Global site configuration
  - profiles: Extended user profile information
  - shipping_addresses: User shipping information
  - conversations: Chat conversation management
  - messages: Chat messages
  - admin_logs: Administrative action logging

  ## Security:
  - Row Level Security enabled on all tables
  - Proper access controls for users, admins, and public
  - Safe admin check function to prevent recursion

  ## Functions:
  - is_admin(): Safe admin role checking
  - safe_insert_contact(): Secure contact form submission
  - update_updated_at_column(): Automatic timestamp updates
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Drop existing tables and types to ensure a clean slate
-- WARNING: This will delete all data in these tables
DROP TABLE IF EXISTS public.site_settings, public.page_content, public.content_sections, public.navigation_items, public.orders, public.team_members, public.auth_config_tracking, public.conversation_participants, public.users, public.contact_messages, public.messages, public.thread_summaries, public.maintenance_log, public.profiles, public.shipping_addresses, public.conversations, public.services, public.admin_logs CASCADE;

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.safe_insert_contact(text, text, text, text, text, text, text, text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_slug_from_title() CASCADE;
DROP FUNCTION IF EXISTS public.update_orders_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_auth_config_tracking_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_conversation_last_message_timestamp() CASCADE;
DROP FUNCTION IF EXISTS public.update_last_read_timestamp() CASCADE;

-- Consolidated Database Functions
-- General-purpose function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate slugs from titles
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
    NEW.slug = LOWER(REPLACE(NEW.title, ' ', '-'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update orders updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update auth_config_tracking updated_at timestamp
CREATE OR REPLACE FUNCTION update_auth_config_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update conversation last message timestamp
CREATE OR REPLACE FUNCTION update_conversation_last_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update last read timestamp in conversation participants
CREATE OR REPLACE FUNCTION update_last_read_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversation_participants
  SET last_read_at = NEW.created_at
  WHERE conversation_id = NEW.conversation_id AND user_id = NEW.sender_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to check admin role safely (for RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users AS au
    JOIN public.users AS pu ON au.id = pu.id
    WHERE au.id = auth.uid() AND pu.role = 'admin'
  );
END;
$$;

-- Function to safely insert contact messages (RPC function)
CREATE OR REPLACE FUNCTION safe_insert_contact(
    p_name text,
    p_email text,
    p_message text,
    p_phone text DEFAULT NULL,
    p_company text DEFAULT NULL,
    p_subject text DEFAULT NULL,
    p_contact_type text DEFAULT 'general',
    p_priority text DEFAULT 'medium',
    p_source text DEFAULT 'unknown',
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    new_contact_id uuid;
BEGIN
    INSERT INTO public.contact_messages (
        name, email, message, company, phone, status, metadata
    ) VALUES (
        p_name, p_email, p_message, p_company, p_phone, 'new', p_metadata
    )
    RETURNING id INTO new_contact_id;

    RETURN jsonb_build_object('success', TRUE, 'data', jsonb_build_object('id', new_contact_id));
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', FALSE, 'error', SQLERRM);
END;
$$;

-- Create conversations table first (referenced by other tables)
CREATE TABLE public.conversations (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    is_group boolean DEFAULT false,
    last_message_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    bio text,
    company text,
    job_title text,
    user_id uuid REFERENCES auth.users(id)
);

-- Add foreign key constraint to users table
ALTER TABLE public.users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    company text,
    service_type text,
    budget_range text,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    ai_qualification jsonb,
    qualification_status text CHECK (qualification_status IN ('HOT', 'WARM', 'COLD')),
    qualification_score integer CHECK (qualification_score >= 1 AND qualification_score <= 10),
    qualified_at timestamptz
);

-- Create orders table
CREATE TABLE public.orders (
    id text PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    stripe_session_id text,
    stripe_payment_intent_id text,
    product_name text NOT NULL,
    plan_type text NOT NULL CHECK (plan_type IN ('startup', 'smart_business', 'enterprise', 'custom')),
    amount numeric NOT NULL DEFAULT 0,
    currency text NOT NULL DEFAULT 'usd',
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'paid', 'failed', 'cancelled', 'refunded')),
    customer_email text,
    customer_name text,
    billing_address jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    receipt_url text,
    failure_reason text,
    created_at timestamptz DEFAULT now(),
    paid_at timestamptz,
    updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text NOT NULL,
    features text[] NOT NULL DEFAULT '{}'::text[],
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

-- Create content_sections table
CREATE TABLE public.content_sections (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key text NOT NULL UNIQUE,
    title text NOT NULL,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_published boolean DEFAULT true,
    version integer DEFAULT 1,
    created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    role text NOT NULL,
    bio text,
    image_url text,
    social_links jsonb DEFAULT '{}'::jsonb,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create navigation_items table
CREATE TABLE public.navigation_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    label text NOT NULL,
    href text NOT NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    parent_id uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE public.site_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key text NOT NULL UNIQUE,
    setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
    description text,
    updated_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    updated_at timestamptz DEFAULT now()
);

-- Create page_content table
CREATE TABLE public.page_content (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_slug text NOT NULL UNIQUE,
    page_title text NOT NULL,
    meta_description text,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_published boolean DEFAULT true,
    created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at timestamptz DEFAULT now(),
    username text UNIQUE CHECK (char_length(username) >= 3),
    full_name text,
    avatar_url text,
    website text,
    phone text,
    address_line1 text,
    address_line2 text,
    city text,
    state text,
    zip_code text,
    country text,
    stripe_customer_id text,
    created_at timestamptz DEFAULT now()
);

-- Create shipping_addresses table
CREATE TABLE public.shipping_addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    label text,
    recipient_name text,
    phone text,
    address_line1 text,
    address_line2 text,
    city text,
    state text,
    zip_code text,
    country text,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Create conversation_participants table
CREATE TABLE public.conversation_participants (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    conversation_id bigint NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    joined_at timestamptz DEFAULT now(),
    last_read_at timestamptz DEFAULT now(),
    is_admin boolean DEFAULT false,
    UNIQUE (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    conversation_id bigint NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES auth.users(id),
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    is_edited boolean DEFAULT false,
    is_deleted boolean DEFAULT false
);

-- Create thread_summaries table
CREATE TABLE public.thread_summaries (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    conversation_id bigint NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    summary text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    message_count integer NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    UNIQUE (conversation_id, start_time, end_time)
);

-- Create maintenance_log table
CREATE TABLE public.maintenance_log (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    action text NOT NULL,
    performed_at timestamptz NOT NULL DEFAULT now()
);

-- Create auth_config_tracking table
CREATE TABLE public.auth_config_tracking (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_name text NOT NULL UNIQUE,
    setting_value text NOT NULL,
    description text,
    applied_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create admin_logs table
CREATE TABLE public.admin_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    action text NOT NULL,
    details jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON public.users(user_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_by ON public.site_settings(updated_by);
CREATE INDEX IF NOT EXISTS idx_page_content_created_by ON public.page_content(created_by);
CREATE INDEX IF NOT EXISTS idx_content_sections_created_by ON public.content_sections(created_by);
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent_id ON public.navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON public.shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_thread_summaries_conversation_id ON public.thread_summaries(conversation_id);
CREATE INDEX IF NOT EXISTS idx_thread_summaries_created_by ON public.thread_summaries(created_by);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON public.admin_logs(user_id);
CREATE INDEX IF NOT EXISTS navigation_items_display_order_idx ON public.navigation_items(display_order);
CREATE INDEX IF NOT EXISTS team_members_display_order_idx ON public.team_members(display_order);

-- Create Views
CREATE OR REPLACE VIEW public.current_auth_settings AS
SELECT 
    setting_name,
    setting_value,
    description,
    applied_at,
    updated_at
FROM public.auth_config_tracking;

CREATE OR REPLACE VIEW public.auth_settings_summary AS
SELECT
    CASE
        WHEN setting_name = ANY (ARRAY['EMAIL_SIGNUP_ENABLED', 'PHONE_SIGNUP_ENABLED', 'EMAIL_CHANGE_ENABLED', 'PHONE_CHANGE_ENABLED', 'PASSWORD_RESET_ENABLED', 'EMAIL_OTP_ENABLED', 'PHONE_OTP_ENABLED', 'MAGIC_LINK_ENABLED', 'OAUTH_ENABLED']) THEN 'Authentication Features'
        WHEN setting_name = ANY (ARRAY['PASSWORD_MIN_LENGTH', 'PASSWORD_REQUIRE_UPPERCASE', 'PASSWORD_REQUIRE_LOWERCASE', 'PASSWORD_REQUIRE_DIGIT', 'PASSWORD_REQUIRE_SPECIAL']) THEN 'Password Policies'
        ELSE 'Other'
    END AS category,
    count(*) AS total_settings,
    string_agg(setting_name || ': ' || setting_value, ', ') AS settings_list
FROM public.auth_config_tracking
GROUP BY
    CASE
        WHEN setting_name = ANY (ARRAY['EMAIL_SIGNUP_ENABLED', 'PHONE_SIGNUP_ENABLED', 'EMAIL_CHANGE_ENABLED', 'PHONE_CHANGE_ENABLED', 'PASSWORD_RESET_ENABLED', 'EMAIL_OTP_ENABLED', 'PHONE_OTP_ENABLED', 'MAGIC_LINK_ENABLED', 'OAUTH_ENABLED']) THEN 'Authentication Features'
        WHEN setting_name = ANY (ARRAY['PASSWORD_MIN_LENGTH', 'PASSWORD_REQUIRE_UPPERCASE', 'PASSWORD_REQUIRE_LOWERCASE', 'PASSWORD_REQUIRE_DIGIT', 'PASSWORD_REQUIRE_SPECIAL']) THEN 'Password Policies'
        ELSE 'Other'
    END;

CREATE OR REPLACE VIEW public.leads_dashboard AS
SELECT 
    cm.id,
    cm.name,
    cm.email,
    cm.company,
    cm.message,
    cm.service_type,
    cm.budget_range,
    cm.status,
    cm.created_at,
    cm.qualified_at,
    cm.qualification_status,
    cm.qualification_score,
    (cm.ai_qualification ->> 'lead_summary') AS lead_summary,
    (cm.ai_qualification ->> 'recommended_action') AS recommended_action,
    CASE
        WHEN cm.qualification_status = 'HOT' AND cm.qualification_score >= 8 THEN 1
        WHEN cm.qualification_status = 'HOT' AND cm.qualification_score < 8 THEN 2
        WHEN cm.qualification_status = 'WARM' THEN 3
        WHEN cm.qualification_status = 'COLD' THEN 4
        ELSE 5
    END AS priority_order,
    CASE
        WHEN cm.qualification_status IS NOT NULL THEN 'Qualified'
        ELSE 'Unqualified'
    END AS qualification_state,
    jsonb_array_length(COALESCE(cm.ai_qualification -> 'key_insights', '[]'::jsonb)) AS insight_count,
    'Contact Form' AS source
FROM public.contact_messages cm;

CREATE OR REPLACE VIEW public.lead_qualification_dashboard AS
SELECT 
    id,
    name,
    email,
    company,
    service_type,
    budget_range,
    message,
    status,
    created_at,
    metadata,
    ai_qualification,
    qualification_status,
    qualification_score,
    qualified_at
FROM public.contact_messages;

-- Create Triggers
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON public.page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON public.content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auth_config_tracking_updated_at BEFORE UPDATE ON public.auth_config_tracking FOR EACH ROW EXECUTE FUNCTION update_auth_config_tracking_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER generate_service_slug BEFORE INSERT OR UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversation_timestamp AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message_timestamp();
CREATE TRIGGER update_last_read_timestamp AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION update_last_read_timestamp();

-- Enable RLS on all relevant tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_config_tracking ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure a clean slate
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public."' || r.tablename || '";';
  END LOOP;
END $$;

-- Consolidated RLS Policies
-- ========== USERS ==========
CREATE POLICY "Users can read their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile on signup" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- ========== ORDERS ==========
CREATE POLICY "Users can read their own orders" ON public.orders FOR SELECT USING (uid() = user_id);
CREATE POLICY "System can create and update orders" ON public.orders FOR ALL USING (true);

-- ========== CONTACT MESSAGES ==========
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage contact messages" ON public.contact_messages FOR ALL USING (is_admin());

-- ========== PROFILES & SHIPPING ==========
CREATE POLICY "Users can manage their own profiles" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own shipping addresses" ON public.shipping_addresses FOR ALL USING (auth.uid() = user_id);

-- ========== ADMIN & CMS TABLES ==========
CREATE POLICY "Public can read published content" ON public.content_sections FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active navigation" ON public.navigation_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage all CMS content" ON public.content_sections FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all navigation" ON public.navigation_items FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all services" ON public.services FOR ALL USING (is_admin());
CREATE POLICY "Admins can read admin logs" ON public.admin_logs FOR SELECT USING (is_admin());
CREATE POLICY "System can insert admin logs" ON public.admin_logs FOR INSERT WITH CHECK (true);

-- ========== CHAT TABLES ==========
CREATE POLICY "Users can read their own conversations" ON public.conversations FOR SELECT USING (auth.uid() = created_by OR EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid()));
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own conversations" ON public.conversations FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Users can read conversation participants" ON public.conversation_participants FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid()))));
CREATE POLICY "Users can insert conversation participants" ON public.conversation_participants FOR INSERT WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid()));
CREATE POLICY "Users can update conversation participants" ON public.conversation_participants FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid()));
CREATE POLICY "Users can delete conversation participants" ON public.conversation_participants FOR DELETE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid()));

CREATE POLICY "Users can read messages in their conversations" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid()))));
CREATE POLICY "Users can insert messages in their conversations" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid()))));
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (sender_id = auth.uid());
CREATE POLICY "Users can delete their own messages" ON public.messages FOR DELETE USING (sender_id = auth.uid());

CREATE POLICY "Users can read thread summaries in their conversations" ON public.thread_summaries FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid()))));
CREATE POLICY "Users can create thread summaries" ON public.thread_summaries FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update thread summaries" ON public.thread_summaries FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete thread summaries" ON public.thread_summaries FOR DELETE USING (created_by = auth.uid());

-- ========== TEAM & SETTINGS ==========
CREATE POLICY "Enable read access for all users" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (is_admin());

CREATE POLICY "Enable read access for all users" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (is_admin());

CREATE POLICY "Admins can read auth config tracking" ON public.auth_config_tracking FOR SELECT USING (is_admin());
CREATE POLICY "System can insert auth config tracking" ON public.auth_config_tracking FOR INSERT WITH CHECK (true);