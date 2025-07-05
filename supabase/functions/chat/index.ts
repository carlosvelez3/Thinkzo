import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Prepare the system message with context about Thinkzo
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant for Thinkzo, a cutting-edge digital agency specializing in AI-powered solutions. Here's what you need to know about Thinkzo:

SERVICES:
- Neural Website Design: AI-powered websites that learn and adapt to user behavior
- Intelligent Branding: Machine learning algorithms create brand identities
- Smart Mobile Apps: Neural-powered mobile applications with predictive features
- Neural Marketing: AI-driven marketing campaigns that optimize themselves
- Cognitive Security: Advanced AI security systems that learn and adapt
- Performance AI: Neural networks that continuously optimize digital infrastructure

PRICING:
- Startup Bundle: $500 (5-page website, basic SEO, mobile-ready)
- Smart Business AI Bundle: $950 (Most Popular - includes AI chatbot, performance monitoring)
- Enterprise Neural Suite: $1,850 (Complete AI solution with advanced integrations)
- Individual services range from $30-$400

TEAM:
- Sarah Chen (CEO): Former Google AI researcher, 10+ years in neural networks
- Marcus Rodriguez (CTO): Full-stack architect, ex-Tesla/SpaceX
- Emily Watson (Head of Design): Award-winning UX designer
- David Kim (AI Research Lead): PhD from MIT, NLP and computer vision expert

CONTACT:
- Email: team@thinkzo.ai
- Phone: +1 (555) 123-4567
- Location: 123 Design Street, Creative City

Be helpful, knowledgeable, and enthusiastic about AI and technology. Always relate responses back to how Thinkzo can help solve business problems with AI. Be conversational but professional.`
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const message = data.choices[0]?.message?.content || 'Sorry, I encountered an error. Please try again.'

    return new Response(
      JSON.stringify({ message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Chat function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact our support team.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})