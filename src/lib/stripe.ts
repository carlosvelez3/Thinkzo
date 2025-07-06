/**
 * Stripe Client Configuration (Minimal)
 * Basic configuration for future payment integration
 */

// Generate unique order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `THZ-${timestamp}-${randomStr}`.toUpperCase();
};

// Format price for display
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};