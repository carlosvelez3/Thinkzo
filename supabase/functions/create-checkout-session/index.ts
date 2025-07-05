import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'npm:stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const { 
      priceId, 
      planType, 
      userId, 
      orderId, 
      productName,
      successUrl, 
      cancelUrl,
      customerEmail,
      customerName,
      additionalMetadata 
    } = await req.json()

    if (!priceId || !planType || !orderId || !productName) {
      throw new Error('Missing required parameters')
    }

    // Create checkout session metadata
    const metadata = {
      user_id: userId || 'guest',
      order_id: orderId,
      product_name: productName,
      plan_type: planType,
      company: 'Thinkzo',
      source: 'website',
      created_at: new Date().toISOString(),
      ...additionalMetadata
    }

    // Create customer data if provided
    const customerData: any = {}
    if (customerEmail) {
      customerData.customer_email = customerEmail
    }
    if (customerName) {
      customerData.customer_creation = 'always'
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing`,
      metadata,
      payment_intent_data: {
        metadata,
        description: `${productName} - Order ${orderId}`,
      },
      ...customerData,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI'],
      },
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Company Name (Optional)',
          },
          type: 'text',
          optional: true,
        },
        {
          key: 'project_details',
          label: {
            type: 'custom',
            custom: 'Project Details (Optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
    })

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
        orderId: orderId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create checkout session',
        details: 'Please check your payment configuration and try again.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})