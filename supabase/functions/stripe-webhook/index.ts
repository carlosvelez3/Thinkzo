import Stripe from 'npm:stripe@14.21.0'
import { createClient } from 'npm:@supabase/supabase-js@2.53.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured')
    }

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log('Processing webhook event:', event.type)
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment completed for session:', session.id)
        
        // Store order in database
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            id: session.id,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            product_name: session.metadata?.plan_name || 'Unknown Plan',
            plan_type: session.metadata?.plan_name?.toLowerCase().includes('starter') ? 'startup' : 
                      session.metadata?.plan_name?.toLowerCase().includes('growth') ? 'smart_business' : 'enterprise',
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'usd',
            status: 'paid',
            customer_email: session.customer_details?.email,
            customer_name: session.customer_details?.name,
            billing_address: session.customer_details?.address,
            metadata: {
              plan_name: session.metadata?.plan_name,
              session_id: session.id,
              payment_intent: session.payment_intent
            },
            paid_at: new Date().toISOString()
          })

        if (orderError) {
          console.error('Error storing order:', orderError)
        } else {
          console.log('Order stored successfully')
        }
        
        break
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment intent succeeded:', paymentIntent.id)
        
        // Update order status if needed
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'completed',
            receipt_url: paymentIntent.charges.data[0]?.receipt_url 
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating order:', updateError)
        }
        
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', failedPayment.id)
        
        // Update order status to failed
        const { error: failError } = await supabase
          .from('orders')
          .update({ 
            status: 'failed',
            failure_reason: failedPayment.last_payment_error?.message || 'Payment failed'
          })
          .eq('stripe_payment_intent_id', failedPayment.id)

        if (failError) {
          console.error('Error updating failed order:', failError)
        }
        
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (_error) {
    console.error('Webhook error:', _error)
    return new Response(
      JSON.stringify({ error: _error instanceof Error ? _error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})