/**
 * Accessible Button Component
 * Enhanced button with proper accessibility features
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25',
    secondary: 'bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-700/70',
    outline: 'border-2 border-slate-600/30 text-slate-300 hover:bg-slate-700/30 hover:text-white',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-700/30'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm space-x-2',
    md: 'px-4 py-3 text-base space-x-2',
    lg: 'px-6 py-4 text-lg space-x-3'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading && (
        <Loader className="animate-spin" size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export default AccessibleButton;