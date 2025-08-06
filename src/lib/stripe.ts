import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with error handling
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will be disabled.');
}

export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export const createCheckoutSession = async (priceId: string, planName: string) => {
  if (!stripePromise) {
    throw new Error('Stripe is not configured. Please check your environment variables.');
  }

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        planName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { url, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    if (!url) {
      throw new Error('No checkout URL received from server');
    }

    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (_error) {
    console.error('Error creating checkout session:', _error);
    throw _error;
  }
};