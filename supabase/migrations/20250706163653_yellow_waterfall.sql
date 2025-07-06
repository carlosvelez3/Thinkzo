/*
  # Update Authentication Configuration

  1. Updates
    - Set password reset email expiry to 30 minutes (1800 seconds)
    - Set magic link expiry to 30 minutes (1800 seconds)
    - Only update if current values are longer than 1 hour

  2. Security
    - Shorter expiry times improve security
    - Reduces window for potential abuse
    - Better user experience with reasonable timeouts
*/

-- Update password reset email expiry to 30 minutes if currently longer than 1 hour
UPDATE auth.config
SET email_template_forgot_password_life_seconds = 1800
WHERE email_template_forgot_password_life_seconds > 3600;

-- Update magic link expiry to 30 minutes if currently longer than 1 hour  
UPDATE auth.config
SET email_template_magic_link_life_seconds = 1800
WHERE email_template_magic_link_life_seconds > 3600;

-- Add comment for documentation
COMMENT ON TABLE auth.config IS 'Authentication configuration with optimized expiry times for security';