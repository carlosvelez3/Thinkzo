/*
  # Database Functions for Schema Introspection and Safe Data Operations

  1. Functions
    - `introspect_columns` - Get table column information
    - `safe_insert_user` - Safely insert users with validation
    - `safe_insert_contact` - Safely insert contacts with validation
    - `get_table_info` - Get comprehensive table schema information

  2. Security
    - All functions use SECURITY DEFINER for proper access control
    - Proper validation and error handling
    - Automatic logging of operations
*/

-- Create introspect_columns function
CREATE OR REPLACE FUNCTION introspect_columns(table_name text)
RETURNS TABLE(name text, data_type text, is_nullable text, column_default text) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    column_name::text,
    data_type::text,
    is_nullable::text,
    column_default::text
  FROM information_schema.columns
  WHERE table_name = introspect_columns.table_name
    AND table_schema = 'public'
  ORDER BY ordinal_position;
END;
$$ LANGUAGE plpgsql;

-- Create safe user insertion function (fixed parameter defaults)
CREATE OR REPLACE FUNCTION safe_insert_user(
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
  IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
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

  -- Insert the user with dynamic column handling
  IF has_phone_column AND has_company_column AND has_job_title_column AND has_bio_column THEN
    -- All optional columns exist
    INSERT INTO users (
      email, full_name, phone, company, job_title, bio, role
    ) VALUES (
      p_email, p_full_name, p_phone, p_company, p_job_title, p_bio, p_role
    ) RETURNING id INTO new_user_id;
  ELSE
    -- Only insert basic columns that we know exist
    INSERT INTO users (email, full_name, role) 
    VALUES (p_email, p_full_name, p_role) 
    RETURNING id INTO new_user_id;
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

-- Create safe contact insertion function (fixed parameter defaults)
CREATE OR REPLACE FUNCTION safe_insert_contact(
  p_name text,
  p_email text,
  p_message text,
  p_phone text DEFAULT NULL,
  p_company text DEFAULT NULL,
  p_subject text DEFAULT NULL,
  p_contact_type text DEFAULT 'general',
  p_priority text DEFAULT 'medium',
  p_source text DEFAULT 'website'
)
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  new_contact_id uuid;
  result json;
  target_table text;
BEGIN
  -- Validate required fields
  IF p_name IS NULL OR p_name = '' THEN
    RETURN json_build_object('success', false, 'error', 'Name is required');
  END IF;
  
  IF p_email IS NULL OR p_email = '' THEN
    RETURN json_build_object('success', false, 'error', 'Email is required');
  END IF;

  IF p_message IS NULL OR p_message = '' THEN
    RETURN json_build_object('success', false, 'error', 'Message is required');
  END IF;

  -- Validate enums with fallbacks
  IF p_contact_type NOT IN ('general', 'support', 'sales', 'feedback', 'bug_report', 'feature_request') THEN
    p_contact_type := 'general';
  END IF;

  IF p_priority NOT IN ('low', 'medium', 'high', 'urgent') THEN
    p_priority := 'medium';
  END IF;

  -- Determine which table to use (contacts or contact_messages)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contacts' AND table_schema = 'public') THEN
    target_table := 'contacts';
  ELSE
    target_table := 'contact_messages';
  END IF;

  -- Insert based on available table
  IF target_table = 'contacts' THEN
    -- Insert into enhanced contacts table
    INSERT INTO contacts (
      name, email, phone, company, subject, message, contact_type, priority, source, status
    ) VALUES (
      p_name, p_email, p_phone, p_company, p_subject, p_message, p_contact_type, p_priority, p_source, 'new'
    ) RETURNING id INTO new_contact_id;
  ELSE
    -- Insert into legacy contact_messages table
    INSERT INTO contact_messages (
      name, email, company, message, status
    ) VALUES (
      p_name, p_email, p_company, p_message, 'new'
    ) RETURNING id INTO new_contact_id;
  END IF;

  -- Log the contact creation if usage_logs table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usage_logs' AND table_schema = 'public') THEN
    INSERT INTO usage_logs (action, resource_type, resource_id, details, success)
    VALUES (
      'contact_created',
      'contact',
      new_contact_id::text,
      json_build_object('email', p_email, 'type', p_contact_type, 'source', p_source),
      true
    );
  END IF;

  -- Return success with contact data
  IF target_table = 'contacts' THEN
    SELECT json_build_object(
      'success', true,
      'data', json_build_object(
        'id', id,
        'name', name,
        'email', email,
        'contact_type', contact_type,
        'status', status,
        'created_at', created_at
      )
    ) INTO result
    FROM contacts WHERE id = new_contact_id;
  ELSE
    SELECT json_build_object(
      'success', true,
      'data', json_build_object(
        'id', id,
        'name', name,
        'email', email,
        'status', status,
        'created_at', created_at
      )
    ) INTO result
    FROM contact_messages WHERE id = new_contact_id;
  END IF;

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Failed to create contact: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to get table schema info
CREATE OR REPLACE FUNCTION get_table_info(table_name text)
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'table_name', table_name,
    'exists', EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = get_table_info.table_name AND table_schema = 'public'
    ),
    'columns', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'name', column_name,
          'type', data_type,
          'nullable', is_nullable = 'YES',
          'default', column_default,
          'max_length', character_maximum_length
        ) ORDER BY ordinal_position
      )
      FROM information_schema.columns
      WHERE table_name = get_table_info.table_name
        AND table_schema = 'public'),
      '[]'::json
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create helper function for dynamic user insertion
CREATE OR REPLACE FUNCTION insert_user_dynamic(user_data json)
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  result json;
  email_val text;
  full_name_val text;
  phone_val text;
  company_val text;
  job_title_val text;
  bio_val text;
  role_val text;
BEGIN
  -- Extract values from JSON
  email_val := user_data->>'email';
  full_name_val := user_data->>'full_name';
  phone_val := user_data->>'phone';
  company_val := user_data->>'company';
  job_title_val := user_data->>'job_title';
  bio_val := user_data->>'bio';
  role_val := COALESCE(user_data->>'role', 'user');

  -- Call the safe_insert_user function
  SELECT safe_insert_user(
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

-- Create helper function for dynamic contact insertion
CREATE OR REPLACE FUNCTION insert_contact_dynamic(contact_data json)
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  result json;
  name_val text;
  email_val text;
  message_val text;
  phone_val text;
  company_val text;
  subject_val text;
  contact_type_val text;
  priority_val text;
  source_val text;
BEGIN
  -- Extract values from JSON
  name_val := contact_data->>'name';
  email_val := contact_data->>'email';
  message_val := contact_data->>'message';
  phone_val := contact_data->>'phone';
  company_val := contact_data->>'company';
  subject_val := contact_data->>'subject';
  contact_type_val := COALESCE(contact_data->>'contact_type', 'general');
  priority_val := COALESCE(contact_data->>'priority', 'medium');
  source_val := COALESCE(contact_data->>'source', 'website');

  -- Call the safe_insert_contact function
  SELECT safe_insert_contact(
    name_val,
    email_val,
    message_val,
    phone_val,
    company_val,
    subject_val,
    contact_type_val,
    priority_val,
    source_val
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION introspect_columns(text) TO authenticated;
GRANT EXECUTE ON FUNCTION safe_insert_user(text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION safe_insert_contact(text, text, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_info(text) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_user_dynamic(json) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_contact_dynamic(json) TO authenticated;

-- Grant execute permissions to anonymous users for contact functions
GRANT EXECUTE ON FUNCTION safe_insert_contact(text, text, text, text, text, text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION insert_contact_dynamic(json) TO anon;