/*
  # Fix user insertion function

  1. New Features
    - Update `safe_insert_user` function to accept user ID parameter
    - Fix parameter handling for proper user creation
    - Ensure compatibility with auth.users foreign key constraint

  2. Security
    - Maintain SECURITY DEFINER for proper access control
    - Preserve existing validation and error handling
*/

-- Update safe_insert_user function to accept user ID parameter
CREATE OR REPLACE FUNCTION safe_insert_user(
  p_id text,
  p_email text,
  p_full_name text,
  p_phone text DEFAULT NULL,
  p_company text DEFAULT NULL,
  p_job_title text DEFAULT NULL,
  p_bio text DEFAULT NULL,
  p_role text DEFAULT 'user'
)
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  result json;
  has_phone_column boolean := false;
  has_company_column boolean := false;
  has_job_title_column boolean := false;
  has_bio_column boolean := false;
BEGIN
  -- Validate required fields
  IF p_id IS NULL OR p_id = '' THEN
    RETURN json_build_object('success', false, 'error', 'User ID is required');
  END IF;
  
  IF p_email IS NULL OR p_email = '' THEN
    RETURN json_build_object('success', false, 'error', 'Email is required');
  END IF;
  
  IF p_full_name IS NULL OR p_full_name = '' THEN
    RETURN json_build_object('success', false, 'error', 'Full name is required');
  END IF;

  -- Validate role
  IF p_role NOT IN ('user', 'admin', 'manager') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid role specified');
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM users WHERE email = p_email AND id != p_id::uuid) THEN
    RETURN json_build_object('success', false, 'error', 'Email already exists');
  END IF;

  -- Check which optional columns exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone' AND table_schema = 'public'
  ) INTO has_phone_column;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'company' AND table_schema = 'public'
  ) INTO has_company_column;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'job_title' AND table_schema = 'public'
  ) INTO has_job_title_column;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bio' AND table_schema = 'public'
  ) INTO has_bio_column;

  -- Convert text ID to UUID
  new_user_id := p_id::uuid;

  -- Insert the user with dynamic column handling
  IF has_phone_column AND has_company_column AND has_job_title_column AND has_bio_column THEN
    -- All optional columns exist
    INSERT INTO users (
      id, email, full_name, phone, company, job_title, bio, role
    ) VALUES (
      new_user_id, p_email, p_full_name, p_phone, p_company, p_job_title, p_bio, p_role
    )
    ON CONFLICT (id) DO UPDATE SET
      email = p_email,
      full_name = p_full_name,
      phone = p_phone,
      company = p_company,
      job_title = p_job_title,
      bio = p_bio,
      role = p_role,
      updated_at = now();
  ELSE
    -- Only insert basic columns that we know exist
    INSERT INTO users (id, email, full_name, role) 
    VALUES (new_user_id, p_email, p_full_name, p_role)
    ON CONFLICT (id) DO UPDATE SET
      email = p_email,
      full_name = p_full_name,
      role = p_role,
      updated_at = now();
  END IF;

  -- Log the user creation if usage_logs table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usage_logs' AND table_schema = 'public') THEN
    INSERT INTO usage_logs (action, resource_type, resource_id, details, success)
    VALUES (
      'user_created',
      'user',
      new_user_id::text,
      json_build_object('email', p_email, 'role', p_role),
      true
    );
  END IF;

  -- Return success with user data
  SELECT json_build_object(
    'success', true,
    'data', json_build_object(
      'id', id,
      'email', email,
      'full_name', full_name,
      'role', role,
      'created_at', created_at
    )
  ) INTO result
  FROM users WHERE id = new_user_id;

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Failed to create user: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- Update the dynamic user insertion function to match
CREATE OR REPLACE FUNCTION insert_user_dynamic(user_data json)
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  result json;
  id_val text;
  email_val text;
  full_name_val text;
  phone_val text;
  company_val text;
  job_title_val text;
  bio_val text;
  role_val text;
BEGIN
  -- Extract values from JSON
  id_val := user_data->>'id';
  email_val := user_data->>'email';
  full_name_val := user_data->>'full_name';
  phone_val := user_data->>'phone';
  company_val := user_data->>'company';
  job_title_val := user_data->>'job_title';
  bio_val := user_data->>'bio';
  role_val := COALESCE(user_data->>'role', 'user');

  -- Call the safe_insert_user function
  SELECT safe_insert_user(
    id_val,
    email_val,
    full_name_val,
    phone_val,
    company_val,
    job_title_val,
    bio_val,
    role_val
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION safe_insert_user(text, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_user_dynamic(json) TO authenticated;