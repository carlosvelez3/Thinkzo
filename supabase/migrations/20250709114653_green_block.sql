/*
  # Update AI Qualification Schema for Contact Messages
  
  1. Updates
    - Adds standard fields to ai_qualification JSON structure
    - Ensures all qualified leads have consistent data format
    - Creates update_lead_qualification_v2 function with proper validation
  
  2. Features
    - Standardized qualification format with lead_summary, qualification_status, etc.
    - Proper validation of qualification status and confidence score
    - Automatic logging of qualification actions
*/

-- First ensure the ai_qualification column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_messages' AND column_name = 'ai_qualification'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN ai_qualification jsonb;
  END IF;
END $$;

-- Update existing records with the new schema
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id, ai_qualification, qualification_status, qualification_score FROM contact_messages WHERE ai_qualification IS NOT NULL
  LOOP
    -- Check if the required fields already exist and update if needed
    IF rec.ai_qualification->>'lead_summary' IS NULL THEN
      UPDATE contact_messages
      SET ai_qualification = jsonb_set(
        COALESCE(ai_qualification, '{}'::jsonb),
        '{lead_summary}',
        to_jsonb('A concise summary of the lead''s project goals and needs.'::text)
      )
      WHERE id = rec.id;
    END IF;
    
    IF rec.ai_qualification->>'qualification_status' IS NULL AND rec.qualification_status IS NOT NULL THEN
      UPDATE contact_messages
      SET ai_qualification = jsonb_set(
        ai_qualification,
        '{qualification_status}',
        to_jsonb(rec.qualification_status::text)
      )
      WHERE id = rec.id;
    END IF;
    
    IF rec.ai_qualification->>'recommended_action' IS NULL THEN
      UPDATE contact_messages
      SET ai_qualification = jsonb_set(
        ai_qualification,
        '{recommended_action}',
        CASE 
          WHEN rec.qualification_status = 'HOT' THEN to_jsonb('Send Calendly link for discovery call.'::text)
          WHEN rec.qualification_status = 'WARM' THEN to_jsonb('Send Calendly link for discovery call, but prepare to clarify goals/budget.'::text)
          WHEN rec.qualification_status = 'COLD' THEN to_jsonb('Send polite ''not a fit'' email or offer resources.'::text)
          ELSE to_jsonb('Review lead details and qualify manually.'::text)
        END
      )
      WHERE id = rec.id;
    END IF;
    
    IF rec.ai_qualification->>'confidence_score' IS NULL THEN
      UPDATE contact_messages
      SET ai_qualification = jsonb_set(
        ai_qualification,
        '{confidence_score}',
        to_jsonb(COALESCE(rec.qualification_score, 5)::int)
      )
      WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;

-- Update the lead-qualifier function to include the new fields
CREATE OR REPLACE FUNCTION update_lead_qualification_v2(
  p_contact_id uuid,
  p_qualification_data jsonb
)
RETURNS json
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
  status_val text;
  score_val integer;
BEGIN
  -- Extract values from qualification data
  status_val := p_qualification_data->>'qualification_status';
  score_val := (p_qualification_data->>'confidence_score')::integer;
  
  -- Validate status
  IF status_val NOT IN ('HOT', 'WARM', 'COLD') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid qualification status');
  END IF;

  -- Validate score
  IF score_val < 1 OR score_val > 10 THEN
    RETURN json_build_object('success', false, 'error', 'Score must be between 1 and 10');
  END IF;

  -- Update the contact
  UPDATE contact_messages 
  SET 
    ai_qualification = p_qualification_data,
    qualification_status = status_val,
    qualification_score = score_val,
    qualified_at = now()
  WHERE id = p_contact_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Contact not found');
  END IF;

  -- Log the qualification
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_logs' AND table_schema = 'public') THEN
    INSERT INTO admin_logs (action, details)
    VALUES (
      'lead_qualified',
      json_build_object(
        'contact_id', p_contact_id,
        'status', status_val,
        'score', score_val,
        'summary', p_qualification_data->>'lead_summary',
        'action', p_qualification_data->>'recommended_action'
      )
    );
  END IF;

  RETURN json_build_object('success', true, 'message', 'Lead qualification updated successfully');

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', 'Failed to update qualification: ' || SQLERRM);
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION update_lead_qualification_v2(uuid, jsonb) TO authenticated;

-- Update the lead-qualifier edge function to include the new fields
COMMENT ON FUNCTION update_lead_qualification_v2(uuid, jsonb) IS 'Updates lead qualification with enhanced AI analysis including lead summary, qualification status, recommended action, and confidence score';