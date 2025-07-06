/*
  # Update OTP Configuration Settings

  1. Updates
    - Add OTP expiry configuration to tracking table
    - Update existing auth settings with OTP values
    - Provide guidance for manual configuration

  2. Manual Configuration Required
    - These settings must be configured in Supabase Dashboard
    - Authentication > Settings > Email Templates
*/

-- Update existing auth config tracking with OTP settings
INSERT INTO auth_config_tracking (setting_name, setting_value, description) VALUES
  (
    'email_template_otp_expiry_minutes',
    '30',
    'OTP (One-Time Password) expiry time in minutes for email verification'
  ),
  (
    'sms_otp_expiry_seconds',
    '1800',
    'SMS OTP expiry time in seconds (30 minutes)'
  ),
  (
    'phone_confirmation_timeout',
    '1800',
    'Phone number confirmation timeout in seconds'
  )
ON CONFLICT (setting_name) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = now();

-- Update the function to include new OTP settings
CREATE OR REPLACE FUNCTION get_auth_configuration_guide()
RETURNS TABLE(
  setting_category text,
  setting_name text, 
  recommended_value text,
  description text,
  dashboard_location text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN act.setting_name LIKE '%otp%' OR act.setting_name LIKE '%phone%' THEN 'OTP & Phone'
      WHEN act.setting_name LIKE '%email%' THEN 'Email Settings'
      ELSE 'General'
    END as setting_category,
    act.setting_name,
    act.setting_value as recommended_value,
    act.description,
    CASE 
      WHEN act.setting_name LIKE '%otp%' THEN 'Authentication > Settings > Phone Auth'
      WHEN act.setting_name LIKE '%email%' THEN 'Authentication > Settings > Email Templates'
      ELSE 'Authentication > Settings'
    END as dashboard_location
  FROM auth_config_tracking act
  ORDER BY setting_category, act.setting_name;
END;
$$;

-- Create a summary view for easy reference
CREATE OR REPLACE VIEW auth_settings_summary AS
SELECT 
  'Email Security' as category,
  COUNT(*) as total_settings,
  string_agg(setting_name, ', ') as settings_list
FROM auth_config_tracking 
WHERE setting_name LIKE '%email%'
UNION ALL
SELECT 
  'OTP & Phone Security' as category,
  COUNT(*) as total_settings,
  string_agg(setting_name, ', ') as settings_list
FROM auth_config_tracking 
WHERE setting_name LIKE '%otp%' OR setting_name LIKE '%phone%';

-- Grant permissions
GRANT SELECT ON auth_settings_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_auth_configuration_guide() TO authenticated;

-- Add helpful comment with manual steps
COMMENT ON FUNCTION get_auth_configuration_guide() IS 'Provides complete guide for configuring Supabase Auth settings manually in dashboard';

/*
  MANUAL CONFIGURATION STEPS:
  
  1. Go to Supabase Dashboard > Authentication > Settings
  
  2. Email Templates Section:
     - Set "Password reset email expiry" to 1800 seconds (30 minutes)
     - Set "Magic link expiry" to 1800 seconds (30 minutes)
     - Set "Email confirmation expiry" to 1800 seconds (30 minutes)
  
  3. Phone Auth Section (if using phone authentication):
     - Set "OTP expiry" to 30 minutes
     - Set "SMS OTP expiry" to 1800 seconds
  
  4. General Settings:
     - Set "Signup confirmation expiry" to 1800 seconds (30 minutes)
  
  To view the complete configuration guide, run:
  SELECT * FROM get_auth_configuration_guide();
  
  To see a summary of settings categories:
  SELECT * FROM auth_settings_summary;
*/