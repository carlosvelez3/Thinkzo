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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 submit-contact function called')
    
    const formData: ContactFormData = await req.json()
    console.log('📝 Received form data:', formData)
    
    // Handle test message
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
    
    // Validate required fields for actual form submissions
    if (!formData.name || !formData.email || (!formData.projectDescription && !formData.message)) {
      throw new Error('Missing required fields: name, email, and project description/message are required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('💾 Storing contact message in database...')
    
    // Store in database
    const { data: contactData, error: dbError } = await supabase
      .from('contact_messages')
      .insert([{
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        service_type: formData.serviceType || null,
        budget_range: formData.budgetRange || null,
        message: formData.projectDescription || formData.message,
        metadata: {
          timeFrame: formData.timeFrame || null,
          submittedAt: new Date().toISOString(),
          userAgent: req.headers.get('user-agent'),
          source: 'submit-contact_edge_function'
        }
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error('Failed to save contact message');
    }

    console.log('✅ Contact message saved to database:', contactData);

    // Send email notification if Resend is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      console.log('📧 Sending email notification...')
      
      const resend = new Resend(resendApiKey)
      
      const emailSubject = `🚀 New Contact from ${formData.name} - Thinkzo.ai`
      const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; text-align: center;">🚀 New Contact Submission</h1>
        <p style="color: #f0f0f0; text-align: center; margin: 10px 0 0 0;">Thinkzo.ai Contact Form</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; margin-top: 0;">📋 Contact Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e; width: 140px;">👤 Name:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${formData.name}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">📧 Email:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${formData.email}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">🏢 Company:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${formData.company || 'Not provided'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">💼 Service:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${formData.serviceType || 'Not specified'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">💰 Budget:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${formData.budgetRange || 'Not specified'}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #34495e;">⏰ Timeline:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${formData.timeFrame || 'Not specified'}</td>
            </tr>
        </table>
    </div>
    
    <div style="background: #e8f4fd; padding: 25px; border-radius: 8px; border-left: 4px solid #3498db;">
        <h3 style="color: #2c3e50; margin-top: 0;">📝 Message</h3>
        <p style="color: #34495e; white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">${formData.projectDescription || formData.message}</p>
    </div>
    
    <div style="background: #f1f2f6; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
        <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
            📅 Submitted: ${new Date().toLocaleString()}<br>
            🌐 Source: submit-contact Edge Function
        </p>
    </div>
</body>
</html>
      `.trim()

      try {
        const emailResult = await resend.emails.send({
          from: 'Thinkzo.ai <onboarding@resend.dev>',
          to: ['team@thinkzo.ai'],
          reply_to: formData.email,
          subject: emailSubject,
          html: emailBody,
        })

        console.log('✅ Email sent successfully:', emailResult)
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError)
        // Don't throw error - form submission should still succeed even if email fails
      }
    } else {
      console.log('⚠️ Resend API key not configured, skipping email notification')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        timestamp: new Date().toISOString(),
        id: contactData.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (_error) {
    console.error('❌ Error processing contact form:', _error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: _error instanceof Error ? _error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})