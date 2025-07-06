/**
 * Success Page Component
 * Displays after successful project submission
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SuccessPage = () => {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Get project ID from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdParam = urlParams.get('project_id');
    
    if (projectIdParam) {
      setProjectId(projectIdParam);
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
            Project Submitted Successfully! 🎉
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Thank you for choosing Thinkzo! Our neural networks are analyzing your requirements.
          </p>
          
          {user && (
            <div className="bg-slate-700/30 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">What's Next?</h3>
              <p className="text-slate-400">
                We'll review your project details and contact you at <span className="text-purple-400">{user.email}</span> within 24 hours with a custom proposal.
              </p>
              {projectId && (
                <p className="text-slate-500 text-sm mt-2">
                  Reference ID: {projectId}
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
                title: 'AI Analysis',
                description: 'Our neural networks analyze your requirements and market data',
                icon: '🧠',
                time: 'Within 2 hours'
              },
              {
                step: '2',
                title: 'Custom Proposal',
                description: 'We create a personalized solution and pricing proposal',
                icon: '📋',
                time: 'Within 24 hours'
              },
              {
                step: '3',
                title: 'Project Kickoff',
                description: 'Once approved, we begin neural assembly of your solution',
                icon: '🚀',
                time: 'Upon approval'
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
            onClick={() => window.location.href = 'mailto:team@thinkzo.ai'}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-purple-500/20"
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