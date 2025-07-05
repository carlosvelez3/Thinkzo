/**
 * Stripe Hook
 * Handles Stripe checkout operations
 */
import { useState } from 'react';
import { stripePromise, generateOrderId, createCheckoutMetadata, PLANS, PlanType } from '../lib/stripe';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createCheckoutSession = async (
    planType: PlanType,
    additionalData?: {
      customerEmail?: string;
      customerName?: string;
      successUrl?: string;
      cancelUrl?: string;
      additionalMetadata?: Record<string, string>;
    }
  ) => {
    try {
      setLoading(true);

      const plan = PLANS[planType];
      if (!plan) {
        throw new Error('Invalid plan type');
      }

      const orderId = generateOrderId();
      
      // Create metadata
      const metadata = createCheckoutMetadata(
        user?.id || null,
        orderId,
        plan.name,
        planType,
        additionalData?.additionalMetadata
      );

      // Call Supabase Edge Function to create checkout session
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planType,
          userId: user?.id || null,
          orderId,
          productName: plan.name,
          customerEmail: additionalData?.customerEmail || user?.email,
          customerName: additionalData?.customerName || user?.user_metadata?.full_name,
          successUrl: additionalData?.successUrl,
          cancelUrl: additionalData?.cancelUrl,
          additionalMetadata: additionalData?.additionalMetadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: use Stripe.js to redirect
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }

      return { orderId, sessionId };
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCustomCheckout = async (
    productName: string,
    amount: number, // in cents
    planType: PlanType = 'startup',
    additionalData?: {
      customerEmail?: string;
      customerName?: string;
      successUrl?: string;
      cancelUrl?: string;
      additionalMetadata?: Record<string, string>;
    }
  ) => {
    try {
      setLoading(true);

      const orderId = generateOrderId();
      
      // For custom amounts, we'll need to create a price on-the-fly
      // This requires a different endpoint or handling in the edge function
      const metadata = createCheckoutMetadata(
        user?.id || null,
        orderId,
        productName,
        planType,
        {
          custom_amount: amount.toString(),
          ...additionalData?.additionalMetadata
        }
      );

      // You would implement this for custom pricing
      toast.info('Custom checkout coming soon! Please contact us for custom pricing.');
      
      return { orderId };
    } catch (error: any) {
      console.error('Custom checkout error:', error);
      toast.error(error.message || 'Failed to create custom checkout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    createCustomCheckout,
    loading,
    plans: PLANS,
  };
};