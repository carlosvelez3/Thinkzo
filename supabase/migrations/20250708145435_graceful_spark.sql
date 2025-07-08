/*
  # Update Supabase Auth Configuration
  
  This migration configures authentication settings for better security:
  - Password reset email expiry: 30 minutes (1800 seconds)
  - Magic link expiry: 30 minutes (1800 seconds)
  
  Note: These settings are typically configured through the Supabase Dashboard
  under Authentication > Settings, but we're documenting the recommended values here.
*/

-- Create a configuration tracking table for our auth settings
CREATE TABLE IF NOT EXISTS auth_config_tracking (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_name text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  description text,
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert recommended auth configuration values
INSERT INTO auth_config_tracking (setting_name, setting_value, description) VALUES
  (
    'email_template_forgot_password_life_seconds',
    '1800',
    'Password reset email expiry time in seconds (30 minutes for security)'
  ),
  (
    'email_template_magic_link_life_seconds', 
    '1800',
    'Magic link email expiry time in seconds (30 minutes for security)'
  ),
  (
    'email_confirm_change_life_seconds',
    '1800', 
    'Email confirmation for email changes expiry (30 minutes)'
  ),
  (
    'email_signup_confirmation_life_seconds',
    '1800',
    'Email signup confirmation expiry (30 minutes)'
  )
ON CONFLICT (setting_name) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = now();

-- Create a function to get recommended auth settings
CREATE OR REPLACE FUNCTION get_recommended_auth_settings()
RETURNS TABLE(setting_name text, setting_value text, description text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    act.setting_name,
    act.setting_value,
    act.description
  FROM auth_config_tracking act
  ORDER BY act.setting_name;
END;
$$;

-- Add trigger for updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_auth_config_tracking_updated_at ON auth_config_tracking;

CREATE OR REPLACE FUNCTION update_auth_config_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_auth_config_tracking_updated_at
  BEFORE UPDATE ON auth_config_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_auth_config_tracking_updated_at();

-- Enable RLS on the tracking table
ALTER TABLE auth_config_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can read auth config" ON auth_config_tracking;
DROP POLICY IF EXISTS "Admins can update auth config" ON auth_config_tracking;

-- Allow admins to read auth config
CREATE POLICY "Admins can read auth config"
  ON auth_config_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Allow admins to update auth config
CREATE POLICY "Admins can update auth config"
  ON auth_config_tracking
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create a view for easy access to current settings
DROP VIEW IF EXISTS current_auth_settings;
CREATE VIEW current_auth_settings AS
SELECT 
  setting_name,
  setting_value,
  description,
  applied_at,
  updated_at
FROM auth_config_tracking
ORDER BY setting_name;

-- Grant access to the view for admins
GRANT SELECT ON current_auth_settings TO authenticated;

-- Add helpful comments
COMMENT ON TABLE auth_config_tracking IS 'Tracks recommended authentication configuration settings for Supabase Auth';
COMMENT ON FUNCTION get_recommended_auth_settings() IS 'Returns all recommended authentication settings with descriptions';
COMMENT ON VIEW current_auth_settings IS 'Current authentication configuration settings';

/*
  MANUAL CONFIGURATION REQUIRED:
  
  The following settings need to be configured manually in the Supabase Dashboard
  under Authentication > Settings:
  
  1. Password reset email expiry: 1800 seconds (30 minutes)
  2. Magic link expiry: 1800 seconds (30 minutes)
  3. Email confirmation expiry: 1800 seconds (30 minutes)
  4. Signup confirmation expiry: 1800 seconds (30 minutes)
  
  These values are now tracked in the auth_config_tracking table for reference.
  
  To view current recommended settings, run:
  SELECT * FROM get_recommended_auth_settings();
*/