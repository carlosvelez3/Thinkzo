/**
 * Authentication Modal Component
 * Handles sign in, sign up, and password reset
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

// Validation schemas
const signInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const signUpSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password cannot be longer than 72 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const resetSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const signInForm = useForm({
    resolver: yupResolver(signInSchema),
  });

  const signUpForm = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const resetForm = useForm({
    resolver: yupResolver(resetSchema),
  });

  const handleSignIn = async (data: any) => {
    setLoading(true);
    const { error } = await signIn(data.email, data.password);
    setLoading(false);
    if (!error) {
      onClose();
    } else {
      // Reset form on error to allow retry
      signInForm.setError('root', { 
        type: 'manual', 
        message: error.message || 'Invalid email or password. Please check your credentials and try again.' 
      });
    }
  };

  const handleSignUp = async (data: any) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setLoading(false);
    if (!error) {
      onClose();
    } else {
      // Reset form on error to allow retry
      signUpForm.setError('root', { 
        type: 'manual', 
        message: 'Please check your information and try again' 
      });
    }
  };

  const handleReset = async (data: any) => {
    setLoading(true);
    const { error } = await resetPassword(data.email);
    setLoading(false);
    if (!error) {
      setMode('signin');
    } else {
      // Reset form on error to allow retry
      resetForm.setError('root', { 
        type: 'manual', 
        message: 'Please check your email and try again' 
      });
    }
  };

  const resetForms = () => {
    signInForm.reset();
    signUpForm.reset();
    resetForm.reset();
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode);
    resetForms();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Reset Password'}
              </h2>
              <p className="text-slate-400">
                {mode === 'signin' && 'Sign in to your account'}
                {mode === 'signup' && 'Join our neural network'}
                {mode === 'reset' && 'Enter your email to reset password'}
              </p>
            </div>

            {/* Sign In Form */}
            {mode === 'signin' && (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      {...signInForm.register('email')}
                      type="email"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  {signInForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      {...signInForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-12 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-1">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white py-3 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/20"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {signInForm.formState.errors.root && (
                  <p className="text-red-400 text-sm text-center">{signInForm.formState.errors.root.message}</p>
                )}

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Forgot your password?
                  </button>
                  <div className="text-slate-400 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Sign Up Form */}
            {mode === 'signup' && (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      {...signUpForm.register('fullName')}
                      type="text"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{signUpForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      {...signUpForm.register('email')}
                      type="email"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      {...signUpForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-12 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-1">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      {...signUpForm.register('confirmPassword')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white py-3 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/20"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                {signUpForm.formState.errors.root && (
                  <p className="text-red-400 text-sm text-center">{signUpForm.formState.errors.root.message}</p>
                )}

                <div className="text-center">
                  <div className="text-slate-400 text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Reset Password Form */}
            {mode === 'reset' && (
              <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      {...resetForm.register('email')}
                      type="email"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  {resetForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">{resetForm.formState.errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white py-3 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/20"
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>

                {resetForm.formState.errors.root && (
                  <p className="text-red-400 text-sm text-center">{resetForm.formState.errors.root.message}</p>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Back to sign in
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;