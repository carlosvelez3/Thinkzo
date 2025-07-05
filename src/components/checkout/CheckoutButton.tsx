/**
 * Checkout Button Component
 * Handles Stripe checkout initiation with metadata
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { useStripe } from '../../hooks/useStripe';
import { PlanType } from '../../lib/stripe';

interface CheckoutButtonProps {
  planType: PlanType;
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  additionalMetadata?: Record<string, string>;
  onSuccess?: (orderId: string) => void;
  onError?: (error: Error) => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  planType,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  additionalMetadata,
  onSuccess,
  onError,
}) => {
  const { createCheckoutSession, loading, plans } = useStripe();

  const plan = plans[planType];

  const handleCheckout = async () => {
    try {
      const result = await createCheckoutSession(planType, {
        additionalMetadata,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (onSuccess && result.orderId) {
        onSuccess(result.orderId);
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/8',
    secondary: 'border-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-white',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCheckout}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-xl font-medium transition-all duration-300 
        flex items-center justify-center space-x-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <CreditCard size={20} />
          <span>{children || `Get ${plan.name} - $${plan.price}`}</span>
        </>
      )}
    </motion.button>
  );
};

export default CheckoutButton;