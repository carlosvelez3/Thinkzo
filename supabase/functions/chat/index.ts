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
- Neural Website Design: AI-powered websites that learn and adapt to user behavior with adaptive UI/UX, smart A/B testing, behavioral analytics, and auto-optimization
- Intelligent Branding: Machine learning algorithms create brand identities with adaptive logos, smart color palettes, AI typography, and brand evolution tracking
- Smart Mobile Apps: Neural-powered mobile applications with predictive UX, smart notifications, adaptive performance, and AI integration
- Neural Marketing: AI-driven marketing campaigns with predictive analytics, smart targeting, auto-optimization, and performance AI
- Cognitive Security: Advanced AI security systems with threat prediction, adaptive defense, smart monitoring, and auto-response
- Performance AI: Neural networks that continuously optimize with smart caching, load prediction, auto-scaling, and performance ML

PRICING PACKAGES:
- Startup Bundle: $500 (Perfect for new businesses - 5-page responsive website with basic AI features)
- Smart Business AI Bundle: $950 (Most Popular - Everything in Startup plus AI chatbot integration, performance monitoring, booking systems)
- Enterprise Neural Suite: $1,850 (Complete AI-powered business solution with advanced integrations and 3 months maintenance)

INDIVIDUAL SERVICES ($30-$400):
- Initial Consultation: $50
- Landing Page Design: $150
- Multi-Page Website: $300-500
- AI Chatbot Integration: $120-250
- SEO Optimization: $80
- Mobile Optimization: $100
- E-Commerce Setup: $250-400
- Performance Monitoring: $120
- Custom AI Tool: $200+
- Ongoing Maintenance: $75-150/month

TEAM:
- Sarah Chen (CEO & Founder): Former Google AI researcher with 10+ years in neural networks, passionate about democratizing AI
- Marcus Rodriguez (CTO): Full-stack architect specializing in scalable AI systems, previously led teams at Tesla and SpaceX
- Emily Watson (Head of Design): Award-winning UX designer with expertise in neural interface design
- David Kim (AI Research Lead): PhD in Computer Science from MIT, specializes in NLP and computer vision

CONTACT & LOCATION:
- Email: team@thinkzo.ai
- Phone: +1 (555) 123-4567
- Office: 123 Design Street, Creative City, CC 12345
- Website: https://thinkzo.ai

COMPANY VALUES:
- Innovation First: Push boundaries of AI and neural networks
- Human-Centered: Technology should enhance human capabilities
- Excellence: Highest standards in code quality and customer service
- Ethical AI: Responsible development considering privacy and fairness

PROCESS:
1. Neural Discovery: AI-powered analysis of business and goals
2. Adaptive Strategy: ML algorithms develop personalized strategies
3. Intelligent Development: Neural network implementation
4. Smart Launch: Automated deployment with continuous learning

Be helpful, knowledgeable, and enthusiastic about AI and technology. Always relate responses back to how Thinkzo can help solve business problems with AI. Be conversational but professional. If asked about pricing, mention the packages and suggest scheduling a consultation for custom quotes. Encourage users to start projects or contact the team for more information.`
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        max_tokens: 800,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', response.status, errorData)
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
    
    // Provide a helpful fallback response
    const fallbackMessage = `I apologize, but I'm experiencing technical difficulties right now. However, I'd be happy to help you learn about Thinkzo's AI-powered services! 

Here's what we offer:
🧠 Neural Website Design - AI websites that adapt to users
🎨 Intelligent Branding - ML-powered brand identities  
📱 Smart Mobile Apps - Predictive mobile experiences
📈 Neural Marketing - Self-optimizing campaigns
🛡️ Cognitive Security - Adaptive AI protection
⚡ Performance AI - Continuous optimization

For immediate assistance, please contact our team:
📧 team@thinkzo.ai
📞 +1 (555) 123-4567

Would you like to know more about any specific service?`

    return new Response(
      JSON.stringify({ message: fallbackMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})