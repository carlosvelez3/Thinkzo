/*
  # Add introspect_columns function and enhanced user utilities

  1. Functions
    - `introspect_columns` - Inspect table schema dynamically
    - `safe_insert_user` - Safely insert users with validation
    - `safe_insert_contact` - Safely insert contacts with validation

  2. Security
    - Functions are accessible to authenticated users
    - Proper validation and error handling
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

-- Create safe user insertion function
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

  -- Insert the user
  INSERT INTO users (
    email, 
    full_name, 
    phone, 
    company, 
    job_title, 
    bio, 
    role,
    is_active,
    email_verified
  ) VALUES (
    p_email,
    p_full_name,
    p_phone,
    p_company,
    p_job_title,
    p_bio,
    p_role,
    true,
    false
  ) RETURNING id INTO new_user_id;

  -- Log the user creation
  INSERT INTO usage_logs (action, resource_type, resource_id, details, success)
  VALUES (
    'user_created',
    'user',
    new_user_id::text,
    json_build_object('email', p_email, 'role', p_role),
    true
  );

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

-- Create safe contact insertion function
CREATE OR REPLACE FUNCTION safe_insert_contact(
  p_name text,
  p_email text,
  p_phone text DEFAULT NULL,
  p_company text DEFAULT NULL,
  p_subject text DEFAULT NULL,
  p_message text,
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

  -- Validate enums
  IF p_contact_type NOT IN ('general', 'support', 'sales', 'feedback', 'bug_report', 'feature_request') THEN
    p_contact_type := 'general';
  END IF;

  IF p_priority NOT IN ('low', 'medium', 'high', 'urgent') THEN
    p_priority := 'medium';
  END IF;

  -- Insert the contact
  INSERT INTO contacts (
    name,
    email,
    phone,
    company,
    subject,
    message,
    contact_type,
    priority,
    source,
    status,
    tags,
    attachments,
    response_sent,
    follow_up_required
  ) VALUES (
    p_name,
    p_email,
    p_phone,
    p_company,
    p_subject,
    p_message,
    p_contact_type,
    p_priority,
    p_source,
    'new',
    '{}',
    '{}',
    false,
    false
  ) RETURNING id INTO new_contact_id;

  -- Log the contact creation
  INSERT INTO usage_logs (action, resource_type, resource_id, details, success)
  VALUES (
    'contact_created',
    'contact',
    new_contact_id::text,
    json_build_object('email', p_email, 'type', p_contact_type, 'source', p_source),
    true
  );

  -- Return success with contact data
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
    'columns', json_agg(
      json_build_object(
        'name', column_name,
        'type', data_type,
        'nullable', is_nullable = 'YES',
        'default', column_default,
        'max_length', character_maximum_length
      ) ORDER BY ordinal_position
    )
  ) INTO result
  FROM information_schema.columns
  WHERE table_name = get_table_info.table_name
    AND table_schema = 'public';

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION introspect_columns(text) TO authenticated;
GRANT EXECUTE ON FUNCTION safe_insert_user(text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION safe_insert_contact(text, text, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_info(text) TO authenticated;