import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2.53.0'
import { Resend } from 'npm:resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  serviceType?: string;
  budgetRange?: string;
  projectDescription: string;
  timeFrame?: string;
  message?: string;
}

/**
 * Sanitize and validate input data
 * Priority: CRITICAL - Security measure
 */
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Rate limiting storage (in-memory for this function)
 * Priority: HIGH - Prevents spam
 */
const submissionTracker = new Map<string, number>();

const isRateLimited = (email: string): boolean => {
  const now = Date.now();
  const lastSubmission = submissionTracker.get(email);
  const RATE_LIMIT_MS = 60000; // 1 minute between submissions per email
  
  if (lastSubmission && (now - lastSubmission) < RATE_LIMIT_MS) {
    return true;
  }
  
  submissionTracker.set(email, now);
  return false;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 submit-contact function called at:', new Date().toISOString())
    
    const formData: ContactFormData = await req.json()
    console.log('📝 Received form data for:', formData.email)
    
    // Handle test message (for development testing)
    if (formData.message === "Hello from the frontend test!") {
      console.log('🧪 Test message received successfully')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Test message received successfully!',
          timestamp: new Date().toISOString(),
          data: formData
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }
    
    // Server-side validation
    const sanitizedData = {
      name: sanitizeInput(formData.name || ''),
      email: sanitizeInput(formData.email || '').toLowerCase(),
      company: formData.company ? sanitizeInput(formData.company) : null,
      serviceType: formData.serviceType ? sanitizeInput(formData.serviceType) : null,
      budgetRange: formData.budgetRange ? sanitizeInput(formData.budgetRange) : null,
      projectDescription: sanitizeInput(formData.projectDescription || formData.message || ''),
      timeFrame: formData.timeFrame ? sanitizeInput(formData.timeFrame) : null
    };

    // Validate required fields
    if (!sanitizedData.name || sanitizedData.name.length < 2 || sanitizedData.name.length > 100) {
      throw new Error('Name must be between 2 and 100 characters')
    }
    
    if (!sanitizedData.email || !validateEmail(sanitizedData.email) || sanitizedData.email.length > 254) {
      throw new Error('Valid email address is required')
    }
    
    if (!sanitizedData.projectDescription || sanitizedData.projectDescription.length < 10 || sanitizedData.projectDescription.length > 2000) {
      throw new Error('Project description must be between 10 and 2000 characters')
    }

    // Rate limiting check
    if (isRateLimited(sanitizedData.email)) {
      console.warn('⚠️ Rate limit exceeded for:', sanitizedData.email)
      throw new Error('Too many submissions. Please wait 1 minute before trying again.')
    }

    // Initialize Supabase client with service role key for bypassing RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase configuration missing')
      throw new Error('Server configuration error')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('💾 Storing contact message in database...')
    
    // Store in database using service role key (bypasses RLS)
    const { data: contactData, error: dbError } = await supabase
      .from('contact_messages')
      .insert([{
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company,
        service_type: sanitizedData.serviceType,
        budget_range: sanitizedData.budgetRange,
        message: sanitizedData.projectDescription,
        status: 'new',
        metadata: {
          timeFrame: sanitizedData.timeFrame,
          submittedAt: new Date().toISOString(),
          userAgent: req.headers.get('user-agent'),
          source: 'submit-contact_edge_function',
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
        }
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error('Failed to save contact message to database');
    }

    console.log('✅ Contact message saved to database with ID:', contactData.id);

    // Send email notification if Resend is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    let emailSent = false;
    
    if (resendApiKey) {
      try {
        console.log('📧 Sending email notification...')
        
        const resend = new Resend(resendApiKey)
        
        const emailSubject = `🚀 New Project Inquiry from ${sanitizedData.name} - Thinkzo.ai`
        const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; text-align: center;">🚀 New Project Inquiry</h1>
        <p style="color: #f0f0f0; text-align: center; margin: 10px 0 0 0;">Thinkzo.ai Contact Form</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; margin-top: 0;">📋 Contact Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e; width: 140px;">👤 Name:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${sanitizedData.name}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">📧 Email:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${sanitizedData.email}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">🏢 Company:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${sanitizedData.company || 'Not provided'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">💼 Service:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${sanitizedData.serviceType || 'Not specified'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">💰 Budget:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${sanitizedData.budgetRange || 'Not specified'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">⏰ Timeline:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${sanitizedData.timeFrame || 'Not specified'}</td>
            </tr>
        </table>
    </div>
    
    <div style="background: #e8f4fd; padding: 25px; border-radius: 8px; border-left: 4px solid #3498db;">
        <h3 style="color: #2c3e50; margin-top: 0;">📝 Project Description</h3>
        <p style="color: #34495e; white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">${sanitizedData.projectDescription}</p>
    </div>
    
    <div style="background: #f1f2f6; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
        <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
            📅 Submitted: ${new Date().toLocaleString()}<br>
            🌐 Source: submit-contact Edge Function<br>
            🆔 Contact ID: ${contactData.id}
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
        <p style="color: white; margin: 0; font-weight: bold;">Ready to respond? Reply directly to this email to contact ${sanitizedData.name}</p>
    </div>
</body>
</html>
        `.trim()

        const emailResult = await resend.emails.send({
          from: 'Thinkzo.ai <onboarding@resend.dev>',
          to: ['team@thinkzo.ai'],
          reply_to: sanitizedData.email,
          subject: emailSubject,
          html: emailBody,
        })

        console.log('✅ Email sent successfully:', emailResult.data?.id)
        emailSent = true;
        
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError)
        // Don't throw error - form submission should still succeed even if email fails
      }
    } else {
      console.log('⚠️ Resend API key not configured, skipping email notification')
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        timestamp: new Date().toISOString(),
        id: contactData.id,
        emailSent: emailSent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
    
  } catch (error) {
    console.error('❌ Error processing contact form:', error)
    
    // Determine appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const statusCode = errorMessage.includes('Rate limit') || errorMessage.includes('Too many') ? 429 : 400
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      },
    )
  }
})