/*
  # Lead Qualification System Enhancement

  1. Updates
    - Add AI qualification columns to contact_messages table
    - Add metadata support for enhanced lead data
    - Create lead qualification functions
    - Add indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Add qualification status filtering
*/

-- Add AI qualification columns to contact_messages table
DO $$
BEGIN
  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;

  -- Add AI qualification columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'ai_qualification'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN ai_qualification jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'qualification_status'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN qualification_status text CHECK (qualification_status IN ('HOT', 'WARM', 'COLD'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'qualification_score'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN qualification_score integer CHECK (qualification_score >= 1 AND qualification_score <= 10);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'qualified_at'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN qualified_at timestamptz;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS contact_messages_qualification_status_idx ON contact_messages(qualification_status);
CREATE INDEX IF NOT EXISTS contact_messages_qualification_score_idx ON contact_messages(qualification_score DESC);
CREATE INDEX IF NOT EXISTS contact_messages_qualified_at_idx ON contact_messages(qualified_at DESC);

-- Update the safe_insert_contact function to support metadata
CREATE OR REPLACE FUNCTION safe_insert_contact(
  p_name text,
  p_email text,
  p_message text,
  p_phone text DEFAULT NULL,
  p_company text DEFAULT NULL,
  p_subject text DEFAULT NULL,
  p_contact_type text DEFAULT 'general',
  p_priority text DEFAULT 'medium',
  p_source text DEFAULT 'website',
  p_metadata jsonb DEFAULT '{}'
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
      name, email, phone, company, subject, message, contact_type, priority, source, status, metadata
    ) VALUES (
      p_name, p_email, p_phone, p_company, p_subject, p_message, p_contact_type, p_priority, p_source, 'new', p_metadata
    ) RETURNING id INTO new_contact_id;
  ELSE
    -- Insert into legacy contact_messages table with metadata support
    INSERT INTO contact_messages (
      name, email, company, message, status, metadata
    ) VALUES (
      p_name, p_email, p_company, p_message, 'new', p_metadata
    ) RETURNING id INTO new_contact_id;
  END IF;

  -- Log the contact creation if usage_logs table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usage_logs' AND table_schema = 'public') THEN
    INSERT INTO usage_logs (action, resource_type, resource_id, details, success)
    VALUES (
      'contact_created',
      'contact',
      new_contact_id::text,
      json_build_object('email', p_email, 'type', p_contact_type, 'source', p_source, 'has_metadata', p_metadata != '{}'),
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
        'metadata', metadata,
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
        'metadata', metadata,
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

-- Create function to get qualified leads summary
CREATE OR REPLACE FUNCTION get_qualified_leads_summary()
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_leads', COUNT(*),
    'hot_leads', COUNT(*) FILTER (WHERE qualification_status = 'HOT'),
    'warm_leads', COUNT(*) FILTER (WHERE qualification_status = 'WARM'),
    'cold_leads', COUNT(*) FILTER (WHERE qualification_status = 'COLD'),
    'unqualified_leads', COUNT(*) FILTER (WHERE qualification_status IS NULL),
    'average_score', ROUND(AVG(qualification_score), 2),
    'last_qualified', MAX(qualified_at)
  ) INTO result
  FROM contact_messages;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to update lead qualification
CREATE OR REPLACE FUNCTION update_lead_qualification(
  p_contact_id uuid,
  p_qualification_data jsonb,
  p_status text,
  p_score integer
)
RETURNS json
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Validate status
  IF p_status NOT IN ('HOT', 'WARM', 'COLD') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid qualification status');
  END IF;

  -- Validate score
  IF p_score < 1 OR p_score > 10 THEN
    RETURN json_build_object('success', false, 'error', 'Score must be between 1 and 10');
  END IF;

  -- Update the contact
  UPDATE contact_messages 
  SET 
    ai_qualification = p_qualification_data,
    qualification_status = p_status,
    qualification_score = p_score,
    qualified_at = now()
  WHERE id = p_contact_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Contact not found');
  END IF;

  -- Log the qualification
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usage_logs' AND table_schema = 'public') THEN
    INSERT INTO usage_logs (action, resource_type, resource_id, details, success)
    VALUES (
      'lead_qualified',
      'contact',
      p_contact_id::text,
      json_build_object('status', p_status, 'score', p_score),
      true
    );
  END IF;

  RETURN json_build_object('success', true, 'message', 'Lead qualification updated successfully');

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', 'Failed to update qualification: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_qualified_leads_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION update_lead_qualification(uuid, jsonb, text, integer) TO authenticated;

-- Add RLS policy for qualification status filtering
CREATE POLICY "Admins can filter by qualification status"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create view for lead qualification dashboard
CREATE OR REPLACE VIEW lead_qualification_dashboard AS
SELECT 
  cm.id,
  cm.name,
  cm.email,
  cm.company,
  cm.message,
  cm.status,
  cm.qualification_status,
  cm.qualification_score,
  cm.ai_qualification,
  cm.metadata,
  cm.created_at,
  cm.qualified_at,
  CASE 
    WHEN cm.qualification_status = 'HOT' THEN 1
    WHEN cm.qualification_status = 'WARM' THEN 2
    WHEN cm.qualification_status = 'COLD' THEN 3
    ELSE 4
  END as priority_order
FROM contact_messages cm
ORDER BY priority_order, cm.qualification_score DESC NULLS LAST, cm.created_at DESC;

-- Grant access to the view
GRANT SELECT ON lead_qualification_dashboard TO authenticated;

-- Add helpful comments
COMMENT ON COLUMN contact_messages.ai_qualification IS 'AI-generated qualification analysis and recommendations';
COMMENT ON COLUMN contact_messages.qualification_status IS 'Lead qualification status: HOT, WARM, or COLD';
COMMENT ON COLUMN contact_messages.qualification_score IS 'AI confidence score from 1-10';
COMMENT ON COLUMN contact_messages.metadata IS 'Additional lead data for AI qualification';
COMMENT ON FUNCTION get_qualified_leads_summary() IS 'Returns summary statistics for lead qualification';
COMMENT ON VIEW lead_qualification_dashboard IS 'Optimized view for lead qualification dashboard';