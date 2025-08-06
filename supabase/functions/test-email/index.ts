import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'npm:resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🧪 Test email function called')
    
    // Initialize Resend with provided API key
    const resend = new Resend('re_Jxy3y88b_JJrw7E6gpkJq97LHnpYJGN2a')
    
    // Create test email content
    const emailSubject = `🧪 Test Email from Thinkzo.ai - ${new Date().toLocaleString()}`
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Email from Thinkzo.ai</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; text-align: center;">🧪 Test Email</h1>
        <p style="color: #f0f0f0; text-align: center; margin: 10px 0 0 0;">Thinkzo.ai Email System Test</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; margin-top: 0;">✅ Email System Status</h2>
        <p style="color: #34495e;">This is a test email to verify that the Thinkzo.ai contact form email system is working correctly.</p>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 15px 0;">
            <p style="color: #155724; margin: 0; font-weight: bold;">✅ Email delivery is working!</p>
        </div>
        
        <h3 style="color: #2c3e50;">📋 Test Details:</h3>
        <ul style="color: #34495e;">
            <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Function:</strong> test-email</li>
            <li><strong>Recipient:</strong> team@thinkzo.ai</li>
            <li><strong>Status:</strong> Email system operational</li>
            <li><strong>API Key:</strong> Configured and working</li>
        </ul>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-top: 20px;">
        <h3 style="color: #856404; margin-top: 0;">⚙️ Next Steps</h3>
        <p style="color: #856404; margin: 0;">
            The contact form is now ready to receive and forward customer inquiries to team@thinkzo.ai. 
            All form submissions will be stored in the database and forwarded via email.
        </p>
    </div>
</body>
</html>
    `.trim()

    console.log('📧 Sending test email to team@thinkzo.ai using Resend...')

    // Send test email using Resend
    const emailResult = await resend.emails.send({
      from: 'Thinkzo.ai <onboarding@resend.dev>',
      to: ['team@thinkzo.ai'],
      subject: emailSubject,
      html: emailBody,
    })

    console.log('✅ Test email sent successfully to team@thinkzo.ai:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully to team@thinkzo.ai',
        timestamp: new Date().toISOString(),
        emailId: emailResult.data?.id,
        recipient: 'team@thinkzo.ai'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (_error) {
    console.error('❌ Error sending test email:', _error)
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