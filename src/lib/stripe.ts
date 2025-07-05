/**
 * Stripe Client Configuration
 * Handles payment processing and checkout sessions
 */
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payments will not work.');
}

export const stripePromise = loadStripe(stripePublishableKey || '');

// Product/Plan configurations
export const PLANS = {
  startup: {
    name: 'Startup Bundle',
    price: 500,
    priceId: 'price_startup_bundle', // Replace with actual Stripe Price ID
    description: 'Perfect for new businesses getting started',
    features: [
      '5-page responsive website',
      'Basic AI features',
      'Mobile optimization',
      'Basic SEO',
      'Hosting & deployment'
    ]
  },
  smart_business: {
    name: 'Smart Business AI Bundle',
    price: 950,
    priceId: 'price_smart_business_bundle', // Replace with actual Stripe Price ID
    description: 'Most popular - AI-powered business solution',
    features: [
      'Everything in Startup Bundle',
      'AI Chatbot integration',
      'Performance monitoring',
      'Booking system',
      'Custom AI tool',
      'Priority support'
    ]
  },
  enterprise: {
    name: 'Enterprise Neural Suite',
    price: 1850,
    priceId: 'price_enterprise_suite', // Replace with actual Stripe Price ID
    description: 'Complete AI-powered business solution',
    features: [
      'Everything in Smart Business Bundle',
      'E-commerce store setup',
      'Advanced AI integrations',
      'Custom brand package',
      'Analytics suite',
      '3 months maintenance'
    ]
  }
} as const;

export type PlanType = keyof typeof PLANS;

// Generate unique order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `THZ-${timestamp}-${randomStr}`.toUpperCase();
};

// Create checkout session metadata
export const createCheckoutMetadata = (
  userId: string | null,
  orderId: string,
  productName: string,
  planType: PlanType,
  additionalData?: Record<string, string>
) => {
  return {
    user_id: userId || 'guest',
    order_id: orderId,
    product_name: productName,
    plan_type: planType,
    company: 'Thinkzo',
    source: 'website',
    ...additionalData
  };
};

// Format price for display
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};