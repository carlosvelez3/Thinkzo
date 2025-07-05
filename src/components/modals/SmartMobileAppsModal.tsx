import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Brain, Bell, Zap, Bot } from 'lucide-react';

interface SmartMobileAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SmartMobileAppsModal: React.FC<SmartMobileAppsModalProps> = ({ isOpen, onClose }) => {
  const mobileFeatures = [
    {
      title: 'Predictive UX',
      definition: 'The interface and user flows adjust based on past behavior, location, time, or intent.',
      examples: [
        'App surfaces commonly used features during specific times of day (e.g., workout tracker opens timer in the morning)',
        'Predictive search/autocomplete based on user history',
        'Autofill actions or content suggestions after 2–3 sessions'
      ],
      whyItMatters: 'Removes friction and anticipates user needs before they tap.',
      color: 'purple',
      icon: Brain,
    },
    {
      title: 'Smart Notifications',
      definition: 'Notifications that are timed, personalized, and context-aware to increase engagement.',
      examples: [
        'AI decides best time to notify each user (based on engagement history)',
        'Notifications adapt in tone or length based on urgency or preference',
        'Dynamic messaging (e.g., "You left off on Page 32" instead of generic alerts)'
      ],
      whyItMatters: 'Boosts retention and reduces notification fatigue.',
      color: 'pink',
      icon: Bell,
    },
    {
      title: 'Adaptive Performance',
      definition: 'Real-time optimization of the app\'s performance based on device, network, and battery status.',
      examples: [
        'Disables animations or switches to lightweight mode on low battery or slow connection',
        'Loads high-res media only when conditions are ideal',
        'Preloads content based on user behavior (reducing perceived wait time)'
      ],
      whyItMatters: 'Ensures smooth, responsive experiences across all devices and conditions.',
      color: 'blue',
      icon: Zap,
    },
    {
      title: 'AI Integration (Core Layer)',
      definition: 'Core functionality is enhanced with embedded AI models or external AI APIs.',
      examples: [
        'Chatbots, voice assistants, or AI agents embedded in the app',
        'On-device ML models for handwriting, voice recognition, or pose detection',
        'AI auto-tagging, photo enhancement, or natural language insights'
      ],
      whyItMatters: 'Makes the app feel alive, intelligent, and helpful—transforming utility into experience.',
      color: 'emerald',
      icon: Bot,
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                  <Smartphone className="text-blue-400" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Smart{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Mobile Apps
                  </span>
                </h2>
              </div>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Discover how AI-powered mobile applications anticipate user needs, adapt to behavior, 
                and deliver intelligent experiences that feel truly alive.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mobileFeatures.map((feature, index) => (
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

                  {/* Examples */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-pink-300 mb-3">Examples:</h4>
                    <ul className="space-y-3">
                      {feature.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300 text-sm leading-relaxed">{example}</span>
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
              className="text-center mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Build an Intelligent Mobile App?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Let our AI create a mobile application that learns from users, predicts their needs, 
                and delivers experiences that feel truly intelligent and alive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-blue-500/20"
                >
                  Start Smart App
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-slate-600/30 text-slate-300 px-8 py-3 rounded-xl font-medium hover:bg-slate-700/30 hover:text-white transition-all duration-300"
                >
                  View Prototypes
                </motion.button>
              </div>
            </motion.div>

            {/* Neural Animation Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-3xl">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.circle
                    key={i}
                    cx={15 + (i % 3) * 30}
                    cy={20 + Math.floor(i / 3) * 20}
                    r="1.5"
                    fill="url(#mobileGradient)"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.8, 1]
                    }}
                    transition={{
                      duration: 1.8,
                      delay: i * 0.25,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                <defs>
                  <linearGradient id="mobileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
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

export default SmartMobileAppsModal;