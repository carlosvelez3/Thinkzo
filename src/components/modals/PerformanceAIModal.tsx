import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, BarChart3, TrendingUp, Settings } from 'lucide-react';

interface PerformanceAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerformanceAIModal: React.FC<PerformanceAIModalProps> = ({ isOpen, onClose }) => {
  const performanceFeatures = [
    {
      title: 'Smart Caching',
      definition: 'AI identifies and caches high-demand data or pages before users request them, adjusting dynamically based on usage patterns.',
      features: [
        'Predictive pre-caching (e.g., load tomorrow\'s content today)',
        'AI-driven cache invalidation—removes stale data intelligently',
        'Device-aware caching (e.g., smaller assets for mobile users)'
      ],
      whyItMatters: 'Massively reduces load times and server strain without manual tuning.',
      color: 'lime',
      icon: Zap
    },
    {
      title: 'Load Prediction',
      definition: 'Machine learning models forecast future traffic spikes or server load based on user behavior, time patterns, events, or campaign schedules.',
      features: [
        'Forecasts daily/weekly peak times (e.g., coffee app traffic spikes at 8AM)',
        'Alerts you before traffic surges—so you can prepare or auto-scale',
        'Prevents downtime from unexpected surges (product drops, flash sales)'
      ],
      whyItMatters: 'Avoids performance crashes, keeps experiences fast during high demand.',
      color: 'blue',
      icon: BarChart3
    },
    {
      title: 'Auto-Scaling (Neural-Optimized)',
      definition: 'AI dynamically adjusts compute, memory, and bandwidth resources based on live demand—not just CPU load.',
      features: [
        'Smart scaling across multiple services (e.g., frontend, DB, API gateway)',
        'Neural systems learn from past traffic to better handle future surges',
        'Real-time rollback and stabilization if scaling fails'
      ],
      whyItMatters: 'Minimizes over-provisioning while ensuring uptime and speed.',
      color: 'purple',
      icon: TrendingUp
    },
    {
      title: 'Performance ML',
      definition: 'AI models continuously learn from infrastructure metrics (latency, throughput, user drop-offs) to optimize performance tuning and bottleneck resolution.',
      features: [
        'Autonomous database query optimization',
        'Identifies slow endpoints, pages, or app features and suggests/code-generates fixes',
        'AI-driven CDN routing and asset compression'
      ],
      whyItMatters: 'Continuously improves your infrastructure—even while you sleep.',
      color: 'emerald',
      icon: Settings
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-slate-700/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 z-10"
            >
              <X size={24} />
            </motion.button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-lime-500/20 to-emerald-500/20 border border-lime-500/30 rounded-2xl flex items-center justify-center">
                  <Zap className="text-lime-400" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Performance{' '}
                  <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                    AI
                  </span>
                </h2>
              </div>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Discover how AI-powered performance systems predict load, optimize resources, and 
                continuously improve your infrastructure for peak efficiency.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {performanceFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-slate-700/30 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 hover:bg-slate-700/40 transition-all duration-300"
                >
                  {/* Feature Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 border border-${feature.color}-500/30 rounded-xl flex items-center justify-center`}>
                      <feature.icon className={`text-${feature.color}-400`} size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>

                  {/* Definition */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Definition:</h4>
                    <p className="text-slate-300 leading-relaxed">{feature.definition}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-pink-300 mb-3">Features:</h4>
                    <ul className="space-y-3">
                      {feature.features.map((featureItem, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300 text-sm leading-relaxed">{featureItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Why It Matters */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                    <h4 className="text-lg font-semibold text-emerald-300 mb-2">Why It Matters:</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{feature.whyItMatters}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12 p-8 bg-gradient-to-r from-lime-500/10 to-emerald-500/10 border border-lime-500/20 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Supercharge Your Performance with AI?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Let our neural networks analyze your infrastructure, predict performance bottlenecks, 
                and continuously optimize your systems for lightning-fast experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-lime-500/30 to-emerald-500/30 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-lime-500/20"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-slate-600/30 text-slate-300 px-8 py-3 rounded-xl font-medium hover:bg-slate-700/30 hover:text-white transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* Neural Animation Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-3xl">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.circle
                    key={i}
                    cx={20 + (i % 3) * 30}
                    cy={25 + Math.floor(i / 3) * 25}
                    r="1.8"
                    fill="url(#performanceGradient)"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 2, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                <defs>
                  <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#84cc16" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceAIModal;