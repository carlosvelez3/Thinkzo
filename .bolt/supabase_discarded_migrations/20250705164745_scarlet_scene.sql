/*
  # Fix SQL Function Parameter Ordering

  1. Database Functions
    - Reorder parameters in safe_insert_user function
    - Reorder parameters in safe_insert_contact function
    - Ensure required parameters come before optional ones with defaults

  2. Parameter Rules
    - Required parameters first
    - Optional parameters with defaults last
    - Consistent ordering throughout
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS safe_insert_user(text, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS safe_insert_contact(text, text, text, text, text, text, text, text, text);

-- Create safe_insert_user function with correct parameter ordering
CREATE OR REPLACE FUNCTION safe_insert_user(
  p_email text,
  p_full_name text,
  p_phone text DEFAULT NULL,
  p_company text DEFAULT NULL,
  p_job_title text DEFAULT NULL,
  p_bio text DEFAULT NULL,
  p_role text DEFAULT 'user'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_data jsonb;
  user_record users%ROWTYPE;
BEGIN
  -- Validate required parameters
  IF p_email IS NULL OR p_email = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email is required');
  END IF;

  IF p_full_name IS NULL OR p_full_name = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Full name is required');
  END IF;

  -- Validate role
  IF p_role NOT IN ('user', 'admin', 'manager') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid role specified');
  END IF;

  -- Check if user already exists
  SELECT * INTO user_record FROM users WHERE email = p_email;
  
  IF FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User with this email already exists');
  END IF;

  -- Insert new user
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
  ) RETURNING * INTO user_record;

  -- Build result
  result_data := jsonb_build_object(
    'id', user_record.id,
    'email', user_record.email,
    'full_name', user_record.full_name,
    'role', user_record.role,
    'created_at', user_record.created_at
  );

  RETURN jsonb_build_object('success', true, 'data', result_data);

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'User with this email already exists');
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Failed to create user: ' || SQLERRM);
END;
$$;

-- Create safe_insert_contact function with correct parameter ordering
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
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_data jsonb;
  contact_record contacts%ROWTYPE;
BEGIN
  -- Validate required parameters
  IF p_name IS NULL OR p_name = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Name is required');
  END IF;

  IF p_email IS NULL OR p_email = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email is required');
  END IF;

  IF p_message IS NULL OR p_message = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Message is required');
  END IF;

  -- Validate contact_type
  IF p_contact_type NOT IN ('general', 'support', 'sales', 'feedback', 'bug_report', 'feature_request') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid contact type');
  END IF;

  -- Validate priority
  IF p_priority NOT IN ('low', 'medium', 'high', 'urgent') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid priority level');
  END IF;

  -- Insert new contact
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
    COALESCE(p_subject, 'Contact Form Submission'),
    p_message,
    p_contact_type,
    p_priority,
    p_source,
    'new',
    ARRAY[]::text[],
    ARRAY[]::text[],
    false,
    true
  ) RETURNING * INTO contact_record;

  -- Build result
  result_data := jsonb_build_object(
    'id', contact_record.id,
    'name', contact_record.name,
    'email', contact_record.email,
    'contact_type', contact_record.contact_type,
    'priority', contact_record.priority,
    'status', contact_record.status,
    'created_at', contact_record.created_at
  );

  RETURN jsonb_build_object('success', true, 'data', result_data);

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Failed to create contact: ' || SQLERRM);
END;
$$;

-- Create helper function for table introspection
CREATE OR REPLACE FUNCTION introspect_columns(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'column_name', column_name,
      'data_type', data_type,
      'is_nullable', is_nullable,
      'column_default', column_default
    )
  ) INTO result
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = introspect_columns.table_name;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Create helper function for table information
CREATE OR REPLACE FUNCTION get_table_info(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'table_name', table_name,
    'columns', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'column_name', column_name,
          'data_type', data_type,
          'is_nullable', is_nullable,
          'column_default', column_default,
          'ordinal_position', ordinal_position
        )
      )
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = get_table_info.table_name
      ORDER BY ordinal_position
    ),
    'constraints', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'constraint_name', constraint_name,
          'constraint_type', constraint_type
        )
      )
      FROM information_schema.table_constraints
      WHERE table_schema = 'public' AND table_name = get_table_info.table_name
    )
  ) INTO result;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION safe_insert_user(text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION safe_insert_contact(text, text, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION introspect_columns(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_info(text) TO authenticated;