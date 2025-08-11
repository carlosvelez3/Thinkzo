import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData: ContactFormData = await req.json()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.projectDescription) {
      throw new Error('Missing required fields: name, email, and project description are required')
    }

    // Initialize Resend with API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('Resend API key not configured')
    }
    const resend = new Resend(resendApiKey)

    // Create email content
    const emailSubject = `🚀 New Project Inquiry from ${formData.name} - Thinkzo.ai`
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
        <h3 style="color: #2c3e50; margin-top: 0;">📝 Project Description</h3>
        <p style="color: #34495e; white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">${formData.projectDescription}</p>
    </div>
    
    <div style="background: #f1f2f6; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
        <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
            📅 Submitted: ${new Date().toLocaleString()}<br>
            🌐 Source: Thinkzo.ai Contact Form
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
        <p style="color: white; margin: 0; font-weight: bold;">Ready to respond? Reply directly to this email to contact ${formData.name}</p>
    </div>
</body>
</html>
    `.trim()

    console.log('📧 Sending email to team@thinkzo.ai using Resend...')

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: 'Thinkzo.ai <onboarding@resend.dev>',
      to: ['team@thinkzo.ai'],
      reply_to: formData.email,
      subject: emailSubject,
      html: emailBody,
    })

    console.log('✅ Email sent successfully to team@thinkzo.ai:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted and email sent to team@thinkzo.ai',
        timestamp: new Date().toISOString(),
        emailId: emailResult.data?.id
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