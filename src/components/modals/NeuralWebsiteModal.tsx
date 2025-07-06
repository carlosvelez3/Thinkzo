import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Zap, BarChart3, Settings, Eye } from 'lucide-react';

interface NeuralWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NeuralWebsiteModal: React.FC<NeuralWebsiteModalProps> = ({ isOpen, onClose }) => {
  const websiteFeatures = [
    {
      title: 'Adaptive UI/UX',
      definition: 'Interfaces that evolve based on user behavior, device type, and preferences.',
      features: [
        'Personalized content blocks (e.g., returning visitors see different CTAs)',
        'Layout reshuffling based on usage patterns (heatmaps, scroll depth)',
        'Accessibility-aware adjustments (font size, contrast, voice input)'
      ],
      impact: 'Delivers a tailored experience for each visitor—boosting usability and satisfaction.',
      color: 'purple',
      icon: Zap
    },
    {
      title: 'Smart A/B Testing (Auto-Driven)',
      definition: 'AI dynamically creates and tests variations (not just A vs. B) and allocates traffic to the best performers.',
      features: [
        'No manual test setup; AI identifies elements to test (buttons, headlines, images)',
        'Real-time traffic distribution adjustments',
        'Continuous experimentation engine—test, learn, evolve'
      ],
      impact: 'Faster optimization cycles, higher ROI, and better user experience over time.',
      color: 'pink',
      icon: BarChart3
    },
    {
      title: 'Behavioral Analytics',
      definition: 'AI interprets how users interact with your site, then translates that into actionable design intelligence.',
      features: [
        'Heatmaps, rage-click detection, hover tracking',
        'Conversion path mapping (where users drop off)',
        'Emotion + intent prediction using session behavior'
      ],
      impact: 'Understand why users behave the way they do—not just what they do.',
      color: 'blue',
      icon: Eye
    },
    {
      title: 'Auto-Optimization Engine',
      definition: 'An AI backend that constantly tunes site components—content, layout, forms—for peak performance.',
      features: [
        'Dynamic CTA switching (based on user type or behavior)',
        'Real-time image/text variation swapping',
        'Performance alerts with suggested UX fixes'
      ],
      impact: 'Hands-off optimization that improves conversion rates automatically.',
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center">
                  <Brain className="text-purple-400" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Neural{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Website Design
                  </span>
                </h2>
              </div>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Discover how AI-powered websites learn, adapt, and optimize themselves to deliver 
                personalized experiences for every visitor.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {websiteFeatures.map((feature, index) => (
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
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300 text-sm leading-relaxed">{featureItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                    <h4 className="text-lg font-semibold text-emerald-300 mb-2">Impact:</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{feature.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Build an Intelligent Website?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Let our neural networks create a website that learns from your users and 
                continuously optimizes for better performance and conversions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-purple-500/20"
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
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.circle
                    key={i}
                    cx={10 + (i % 4) * 25}
                    cy={15 + Math.floor(i / 4) * 25}
                    r="1"
                    fill="url(#neuralGradient)"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                <defs>
                  <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
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

export default NeuralWebsiteModal;