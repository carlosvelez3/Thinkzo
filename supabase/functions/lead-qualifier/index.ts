import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadData {
  lead_name: string;
  lead_email: string;
  company_name?: string;
  company_website?: string;
  project_goals: string;
  budget: string;
  timeline?: string;
  additional_notes?: string;
  service_type?: string;
  source: string;
}

interface QualificationResult {
  lead_summary: string;
  qualification_status: 'HOT' | 'WARM' | 'COLD';
  recommended_action: string;
  confidence_score: number;
  key_insights: string[];
  next_steps: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const leadData: LeadData = await req.json()

    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Prepare the AI qualification prompt
    const qualificationPrompt = `You are an expert lead qualification specialist for Thinkzo, a solo-founder AI-powered web design agency. Your task is to efficiently process incoming lead information, identify key details, assess their potential fit, and recommend the best next action.

THINKZO SERVICES & PRICING:
- Neural Website Design: $2,000-$8,000 (AI-powered adaptive websites)
- Intelligent Branding: $1,500-$5,000 (ML-driven brand systems)
- Smart Mobile Apps: $5,000-$15,000 (AI-enhanced mobile experiences)
- Neural Marketing: $1,000-$4,000/month (AI-driven campaigns)
- Performance AI: $800-$2,500/month (Continuous optimization)

TARGET CLIENTS:
- Small to medium businesses ready to invest in AI technology
- Companies with $50K+ annual revenue
- Businesses seeking competitive advantage through AI
- Organizations valuing innovation and cutting-edge solutions

Here is the lead's information:
Lead Name: ${leadData.lead_name}
Lead Email: ${leadData.lead_email}
Company Name: ${leadData.company_name || 'Not provided'}
Company Website: ${leadData.company_website || 'Not provided'}
Project Goals: ${leadData.project_goals}
Budget: ${leadData.budget}
Timeline: ${leadData.timeline || 'Not specified'}
Service Interest: ${leadData.service_type || 'General inquiry'}
Additional Notes: ${leadData.additional_notes || 'None'}
Source: ${leadData.source}

Based on the information above, please perform the following:

1. **Summarize Key Needs:** Provide a 1-2 sentence summary of the lead's primary project goals and requirements.

2. **Assess Qualification:** Classify this lead as "HOT," "WARM," or "COLD" based on:
   - Budget alignment with Thinkzo's pricing
   - Timeline urgency and realism
   - Clarity and specificity of goals
   - Company size and revenue potential
   - Fit for AI-powered solutions

   **HOT:** Clear goals, realistic budget ($2K+), urgent timeline, strong AI fit
   **WARM:** Somewhat clear goals, potentially flexible budget ($1K+), good potential fit
   **COLD:** Unclear goals, unrealistic budget (<$1K), poor fit for AI solutions

3. **Recommend Next Action:** Suggest the immediate next step:
   - If HOT: "Schedule discovery call immediately - high conversion potential"
   - If WARM: "Send discovery call invite with AI solution examples"
   - If COLD: "Send educational content about AI benefits or polite decline"

4. **Key Insights:** Identify 2-3 key insights about this lead's needs and potential.

5. **Next Steps:** Provide 2-3 specific action items for follow-up.

6. **Confidence Score:** Provide a confidence score (1-10) for your assessment.

Please provide your output in valid JSON format only, no additional text:`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert lead qualification specialist. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: qualificationPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    let qualificationResult: QualificationResult
    try {
      qualificationResult = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      // Fallback qualification
      qualificationResult = {
        lead_summary: `Lead from ${leadData.company_name || 'unknown company'} interested in ${leadData.service_type || 'AI services'}`,
        qualification_status: 'WARM',
        recommended_action: 'Send discovery call invite with AI solution examples',
        confidence_score: 5,
        key_insights: ['AI response parsing failed', 'Manual review required'],
        next_steps: ['Review lead manually', 'Send standard follow-up']
      }
    }

    // Add metadata
    const result = {
      ...qualificationResult,
      processed_at: new Date().toISOString(),
      lead_data: leadData,
      ai_model: 'gpt-4o-mini'
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Lead qualification error:', error)
    
    // Fallback response
    const fallbackResult = {
      lead_summary: 'Lead qualification system temporarily unavailable',
      qualification_status: 'WARM',
      recommended_action: 'Manual review required - system error',
      confidence_score: 1,
      key_insights: ['System error occurred', 'Manual qualification needed'],
      next_steps: ['Review lead manually', 'Check system status'],
      processed_at: new Date().toISOString(),
      error: error.message
    }

    return new Response(
      JSON.stringify(fallbackResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})