import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('Missing Stripe signature')
    }

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log('Received Stripe webhook:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Extract metadata
        const metadata = session.metadata
        const paymentIntentId = session.payment_intent as string

        // Get payment intent for additional details
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        // Store order in database
        const orderData = {
          id: metadata?.order_id,
          user_id: metadata?.user_id !== 'guest' ? metadata?.user_id : null,
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          product_name: metadata?.product_name,
          plan_type: metadata?.plan_type,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'usd',
          status: 'completed',
          customer_email: session.customer_details?.email,
          customer_name: session.customer_details?.name,
          billing_address: session.customer_details?.address,
          metadata: {
            ...metadata,
            stripe_session: session.id,
            payment_method: paymentIntent.payment_method,
            receipt_url: paymentIntent.charges.data[0]?.receipt_url,
          },
          created_at: new Date().toISOString(),
        }

        const { error: orderError } = await supabase
          .from('orders')
          .upsert(orderData)

        if (orderError) {
          console.error('Failed to store order:', orderError)
        } else {
          console.log('Order stored successfully:', metadata?.order_id)
        }

        // Update user subscription if user is logged in
        if (metadata?.user_id && metadata?.user_id !== 'guest') {
          const subscriptionData = {
            user_id: metadata.user_id,
            plan_name: metadata.product_name,
            plan_type: metadata.plan_type,
            status: 'active',
            billing_cycle: 'one_time',
            amount: orderData.amount,
            currency: orderData.currency,
            stripe_payment_intent_id: paymentIntentId,
            features: {},
            usage_limits: {},
            auto_renew: false,
          }

          const { error: subError } = await supabase
            .from('subscriptions')
            .upsert(subscriptionData)

          if (subError) {
            console.error('Failed to update subscription:', subError)
          }
        }

        // Send confirmation email (you can implement this)
        // await sendOrderConfirmationEmail(orderData)

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('Payment succeeded:', paymentIntent.id)
        
        // Update order status if needed
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            paid_at: new Date().toISOString(),
            receipt_url: paymentIntent.charges.data[0]?.receipt_url
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (error) {
          console.error('Failed to update order status:', error)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('Payment failed:', paymentIntent.id)
        
        // Update order status
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'failed',
            failure_reason: paymentIntent.last_payment_error?.message
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (error) {
          console.error('Failed to update order status:', error)
        }

        break
      }

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
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})