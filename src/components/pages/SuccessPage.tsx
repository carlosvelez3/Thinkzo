/**
 * Success Page Component
 * Displays after successful Stripe checkout
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SuccessPage = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      // You could fetch order details here if needed
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
          className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="text-emerald-400" size={48} />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Thank you for choosing Thinkzo! Your neural-powered solution is being prepared.
          </p>
          
          {user && (
            <div className="bg-slate-700/30 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Order Confirmation</h3>
              <p className="text-slate-400">
                A confirmation email has been sent to <span className="text-purple-400">{user.email}</span>
              </p>
              {sessionId && (
                <p className="text-slate-500 text-sm mt-2">
                  Session ID: {sessionId}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">What happens next?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Project Setup',
                description: 'Our AI analyzes your requirements and sets up your project',
                icon: '🧠',
                time: 'Within 24 hours'
              },
              {
                step: '2',
                title: 'Development Begins',
                description: 'Our neural networks start crafting your solution',
                icon: '⚡',
                time: '1-3 business days'
              },
              {
                step: '3',
                title: 'Delivery & Launch',
                description: 'Your intelligent solution goes live',
                icon: '🚀',
                time: 'Based on package'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-slate-700/20 rounded-xl p-4"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                <div className="text-purple-400 text-xs font-medium">{item.time}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-purple-500/20"
          >
            <Download size={20} />
            <span>Download Receipt</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = 'mailto:team@thinkzo.ai'}
            className="flex items-center space-x-2 border-2 border-slate-600/30 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-700/30 hover:text-white transition-all duration-300"
          >
            <Mail size={20} />
            <span>Contact Team</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2 border-2 border-slate-600/30 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-700/30 hover:text-white transition-all duration-300"
          >
            <span>Back to Home</span>
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 pt-6 border-t border-slate-700/50"
        >
          <p className="text-slate-400 text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:team@thinkzo.ai" className="text-purple-400 hover:text-purple-300">
              team@thinkzo.ai
            </a>{' '}
            or{' '}
            <a href="tel:+15551234567" className="text-purple-400 hover:text-purple-300">
              +1 (555) 123-4567
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;