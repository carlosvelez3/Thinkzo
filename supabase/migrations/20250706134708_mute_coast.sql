/*
  # Complete Admin CMS System

  1. New Tables
    - `content_sections` - Editable content sections for all website parts
    - `team_members` - Team member profiles
    - `navigation_items` - Dynamic navigation menu
    - `site_settings` - Global site settings
    - `page_content` - Full page content management

  2. Security
    - Enable RLS on all tables
    - Admin-only write access
    - Public read access for published content

  3. Features
    - Complete website content management
    - Dynamic navigation
    - Team member management
    - Site-wide settings
    - Version control for content
*/

-- Content sections table for all website sections
CREATE TABLE IF NOT EXISTS content_sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  is_published boolean DEFAULT true,
  version integer DEFAULT 1,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  social_links jsonb DEFAULT '{}',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Navigation items table
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label text NOT NULL,
  href text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  description text,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);

-- Page content table for full page management
CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug text UNIQUE NOT NULL,
  page_title text NOT NULL,
  meta_description text,
  content jsonb NOT NULL DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Policies for content_sections
CREATE POLICY "Anyone can read published content sections"
  ON content_sections
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage content sections"
  ON content_sections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for team_members
CREATE POLICY "Anyone can read active team members"
  ON team_members
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for navigation_items
CREATE POLICY "Anyone can read active navigation items"
  ON navigation_items
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage navigation items"
  ON navigation_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for site_settings
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for page_content
CREATE POLICY "Anyone can read published pages"
  ON page_content
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage page content"
  ON page_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS content_sections_section_key_idx ON content_sections(section_key);
CREATE INDEX IF NOT EXISTS team_members_display_order_idx ON team_members(display_order);
CREATE INDEX IF NOT EXISTS navigation_items_display_order_idx ON navigation_items(display_order);
CREATE INDEX IF NOT EXISTS site_settings_setting_key_idx ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS page_content_page_slug_idx ON page_content(page_slug);

-- Update triggers
CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON content_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_navigation_items_updated_at
  BEFORE UPDATE ON navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default content sections
INSERT INTO content_sections (section_key, title, content) VALUES
  ('hero', 'Hero Section', '{
    "title": "Welcome to Thinkzo",
    "subtitle": "Transform your business with AI-powered websites, intelligent marketing, and neural design systems that adapt and evolve with your needs.",
    "primaryButton": "Start Neural Assembly",
    "secondaryButton": "Explore Intelligence"
  }'),
  ('about_mission', 'About Mission', '{
    "title": "Our Mission",
    "content": "At Thinkzo, we believe that artificial intelligence should be a force for human empowerment, not replacement. Our mission is to democratize AI technology by creating intelligent solutions that are accessible, ethical, and transformative.",
    "additionalContent": "We envision a future where every business, regardless of size or technical expertise, can harness the power of neural networks to solve complex problems, enhance creativity, and drive innovation."
  }'),
  ('contact_info', 'Contact Information', '{
    "email": "team@thinkzo.ai",
    "phone": "+1 (555) 123-4567",
    "address": "123 Design Street, Creative City, CC 12345",
    "hours": "Monday - Friday: 9AM - 6PM PST"
  }'),
  ('company_values', 'Company Values', '{
    "values": [
      {
        "title": "Innovation First",
        "description": "We push the boundaries of what''s possible with AI and neural networks to create breakthrough solutions."
      },
      {
        "title": "Human-Centered",
        "description": "Technology should enhance human capabilities, not replace them. We design AI that empowers people."
      },
      {
        "title": "Excellence",
        "description": "We maintain the highest standards in everything we do, from code quality to customer service."
      },
      {
        "title": "Ethical AI",
        "description": "We believe in responsible AI development that considers privacy, fairness, and societal impact."
      }
    ]
  }'),
  ('process_steps', 'Process Steps', '{
    "steps": [
      {
        "title": "Neural Discovery",
        "description": "AI-powered analysis of your business, goals, and market intelligence.",
        "details": ["Smart consultation", "AI requirements gathering", "Neural market research", "Intelligent competitor analysis"]
      },
      {
        "title": "Adaptive Strategy",
        "description": "Machine learning algorithms develop personalized strategies for your needs.",
        "details": ["AI project planning", "Neural design concepts", "Smart architecture", "Predictive timeline creation"]
      },
      {
        "title": "Intelligent Development",
        "description": "Our neural network brings your vision to life with self-optimizing code.",
        "details": ["AI-assisted implementation", "Smart development sprints", "Neural quality assurance", "Adaptive client feedback"]
      },
      {
        "title": "Smart Launch",
        "description": "Automated deployment with continuous learning and intelligent optimization.",
        "details": ["Neural testing", "Smart deployment", "AI training & handover", "Continuous learning support"]
      }
    ]
  }');

-- Insert default team members
INSERT INTO team_members (name, role, bio, image_url, social_links, display_order) VALUES
  ('Sarah Chen', 'CEO & Founder', 'Former Google AI researcher with 10+ years in neural networks and machine learning. Passionate about democratizing AI for businesses.', 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400', '{"linkedin": "#", "twitter": "#", "github": "#"}', 1),
  ('Marcus Rodriguez', 'CTO', 'Full-stack architect specializing in scalable AI systems. Previously led engineering teams at Tesla and SpaceX.', 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400', '{"linkedin": "#", "twitter": "#", "github": "#"}', 2),
  ('Emily Watson', 'Head of Design', 'Award-winning UX designer with expertise in neural interface design. Creates intuitive experiences that bridge human and AI interaction.', 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400', '{"linkedin": "#", "twitter": "#", "github": "#"}', 3),
  ('David Kim', 'AI Research Lead', 'PhD in Computer Science from MIT. Specializes in natural language processing and computer vision applications for business.', 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400', '{"linkedin": "#", "twitter": "#", "github": "#"}', 4);

-- Insert default navigation items
INSERT INTO navigation_items (label, href, display_order) VALUES
  ('Home', 'home', 1),
  ('About', 'about', 2),
  ('Services', 'services', 3),
  ('AI Chat', 'chat', 4),
  ('Contact', 'contact', 5);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
  ('site_title', '"Thinkzo - Marketing & Website Design"', 'Main site title'),
  ('site_description', '"AI-powered digital solutions including neural websites, intelligent marketing, and cognitive design."', 'Site meta description'),
  ('company_name', '"Thinkzo"', 'Company name'),
  ('logo_text', '"Thinkzo"', 'Logo text'),
  ('footer_text', '"© 2024 Thinkzo. All rights reserved."', 'Footer copyright text'),
  ('social_links', '{
    "twitter": "https://twitter.com/thinkzo",
    "linkedin": "https://linkedin.com/company/thinkzo",
    "github": "https://github.com/thinkzo",
    "facebook": "https://facebook.com/thinkzo"
  }', 'Social media links');

-- Insert default page content
INSERT INTO page_content (page_slug, page_title, meta_description, content) VALUES
  ('home', 'Home - Thinkzo', 'Transform your business with AI-powered websites, intelligent marketing, and neural design systems.', '{}'),
  ('about', 'About Us - Thinkzo', 'Learn about our mission to democratize AI technology and our team of experts.', '{}'),
  ('services', 'Our Services - Thinkzo', 'Discover our comprehensive range of AI-powered solutions designed to transform your business.', '{}'),
  ('contact', 'Contact Us - Thinkzo', 'Get in touch with our team to discuss your AI-powered digital transformation.', '{}');