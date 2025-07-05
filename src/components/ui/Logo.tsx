import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'header' | 'footer';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  darkMode?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'md', 
  animated = false, 
  darkMode = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'space-x-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'space-x-3' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', container: 'space-x-4' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', container: 'space-x-5' }
  };

  const colors = {
    light: {
      bg: 'from-purple-500 to-pink-500',
      text: 'text-slate-900',
      icon: 'text-white'
    },
    dark: {
      bg: 'from-purple-500 to-pink-500',
      text: 'text-white',
      icon: 'text-white'
    }
  };

  const currentColors = darkMode ? colors.light : colors.dark;
  const currentSize = sizeClasses[size];

  // Icon component with animation
  const IconComponent = animated ? motion.div : 'div';
  const iconProps = animated ? {
    animate: {
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  // Text component with animation
  const TextComponent = animated ? motion.span : 'span';
  const textProps = animated ? {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  // Neural pulse animation for icon background
  const PulseComponent = animated ? motion.div : 'div';
  const pulseProps = animated ? {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`}>
        <PulseComponent
          {...pulseProps}
          className={`${currentSize.icon} bg-gradient-to-br ${currentColors.bg} rounded-xl flex items-center justify-center relative overflow-hidden`}
        >
          {/* Neural network pattern overlay */}
          {animated && (
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <motion.circle
                  cx="30" cy="30" r="2"
                  fill="currentColor"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.circle
                  cx="70" cy="30" r="2"
                  fill="currentColor"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle
                  cx="50" cy="70" r="2"
                  fill="currentColor"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                />
                <motion.line
                  x1="30" y1="30" x2="70" y2="30"
                  stroke="currentColor"
                  strokeWidth="1"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </div>
          )}
          
          <IconComponent {...iconProps}>
            <Brain className={`${currentColors.icon} relative z-10`} size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 28 : 36} />
          </IconComponent>
        </PulseComponent>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* Icon */}
      <div className="relative">
        <PulseComponent
          {...pulseProps}
          className={`${currentSize.icon} bg-gradient-to-br ${currentColors.bg} rounded-xl flex items-center justify-center relative overflow-hidden`}
        >
          {/* Neural network pattern overlay */}
          {animated && (
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <motion.circle
                  cx="25" cy="25" r="1.5"
                  fill="currentColor"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.circle
                  cx="75" cy="25" r="1.5"
                  fill="currentColor"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle
                  cx="50" cy="75" r="1.5"
                  fill="currentColor"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                />
                <motion.line
                  x1="25" y1="25" x2="75" y2="25"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.line
                  x1="25" y1="25" x2="50" y2="75"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.line
                  x1="75" y1="25" x2="50" y2="75"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </svg>
            </div>
          )}
          
          <IconComponent {...iconProps}>
            <Brain className={`${currentColors.icon} relative z-10`} size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 28 : 36} />
          </IconComponent>
        </PulseComponent>

        {/* Neural spark effect */}
        {animated && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeOut"
            }}
          >
            <Zap className="text-yellow-400" size={size === 'sm' ? 8 : size === 'md' ? 10 : 12} />
          </motion.div>
        )}
      </div>

      {/* Text */}
      {variant !== 'icon' && (
        <TextComponent
          {...textProps}
          className={`${currentColors.text} font-bold ${currentSize.text} ${animated ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_100%]' : ''}`}
          style={animated ? { backgroundSize: '200% 100%' } : {}}
        >
          Thinkzo
        </TextComponent>
      )}

      {/* Neural tagline for full variant */}
      {variant === 'full' && size !== 'sm' && (
        <div className="flex flex-col">
          <TextComponent
            {...textProps}
            className={`${currentColors.text} font-bold ${currentSize.text} ${animated ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_100%]' : ''}`}
            style={animated ? { backgroundSize: '200% 100%' } : {}}
          >
            Thinkzo
          </TextComponent>
          <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'} font-medium tracking-wider uppercase`}>
            Neural Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;