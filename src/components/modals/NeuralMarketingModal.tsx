import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';

interface NeuralMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NeuralMarketingModal: React.FC<NeuralMarketingModalProps> = ({ isOpen, onClose }) => {
  const marketingFeatures = [
    {
      title: 'Predictive Analytics',
      definition: 'Uses historical and real-time data to forecast customer behavior, trends, and campaign performance.',
      keyFunctions: [
        'Churn prediction: Know which customers might leave and proactively re-engage them',
        'Purchase prediction: Forecast when a user is likely to order again (e.g., coffee app knows average re-order interval)',
        'Trend modeling: Automatically suggest products or offers based on seasonal or viral demand'
      ],
      whyItWorks: 'Lets you act before users click, bounce, or disappear.',
      color: 'purple',
      emoji: '🔮'
    },
    {
      title: 'Smart Targeting',
      definition: 'AI segments your audience automatically based on behavior, demographics, psychographics, and live data.',
      keyFunctions: [
        'Dynamic email list creation (e.g., "espresso lovers who visit between 9–11AM")',
        'Lookalike audiences across platforms (Facebook, TikTok, YouTube)',
        'AI persona generation: Build evolving customer personas for ads and content tuning'
      ],
      whyItWorks: 'Targets the right person at the right time with the right message.',
      color: 'pink',
      emoji: '🎯'
    },
    {
      title: 'Auto-optimization',
      definition: 'The marketing engine adjusts ad spend, copy, visuals, and channel distribution in real time—based on what\'s working best.',
      keyFunctions: [
        'Swap creative mid-campaign without human input',
        'Allocate budget toward high-performing audiences/platforms',
        'Automated multivariate testing (headlines, thumbnails, CTAs)'
      ],
      whyItWorks: 'Reduces wasted ad spend and boosts conversions while you sleep.',
      color: 'blue',
      emoji: '⚙️'
    },
    {
      title: 'Performance AI',
      definition: 'A real-time AI layer that monitors marketing KPIs and acts on them automatically.',
      keyFunctions: [
        'Live dashboards with next-best-action recommendations',
        'AI-generated campaign copy or visuals based on brand tone + goal',
        'Emergency alerts: e.g., "Email open rate dropped 20% — consider subject line refresh."'
      ],
      whyItWorks: 'Keeps your campaigns always-on, always-optimized—even without a full team.',
      color: 'emerald',
      emoji: '🤖'
    }
  ];

  const perfectForExamples = [
    {
      business: 'Coffee Shops',
      description: 'Personalized promo SMS/email just before peak hours',
      color: 'amber',
      emoji: '☕'
    },
    {
      business: 'Apparel Brands',
      description: 'Dynamic retargeting ads with trending product designs',
      color: 'rose',
      emoji: '👕'
    },
    {
      business: 'SaaS Platforms',
      description: 'AI emails based on user journey drop-offs',
      color: 'blue',
      emoji: '💻'
    },
    {
      business: 'Content Creators',
      description: 'Auto-posting at optimal engagement hours',
      color: 'purple',
      emoji: '🎥'
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
            className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto relative"
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
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-400" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Neural{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Marketing
                  </span>
                </h2>
              </div>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Discover how AI-powered marketing systems predict customer behavior, optimize campaigns 
                automatically, and deliver personalized experiences at scale.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {marketingFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-slate-700/30 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 hover:bg-slate-700/40 transition-all duration-300"
                >
                  {/* Feature Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-3xl">{feature.emoji}</div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>

                  {/* Definition */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Definition:</h4>
                    <p className="text-slate-300 leading-relaxed">{feature.definition}</p>
                  </div>

                  {/* Key Functions */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-pink-300 mb-3">Key Functions:</h4>
                    <ul className="space-y-3">
                      {feature.keyFunctions.map((func, funcIndex) => (
                        <li key={funcIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300 text-sm leading-relaxed">{func}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Why It Works */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                    <h4 className="text-lg font-semibold text-emerald-300 mb-2">Why It Works:</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{feature.whyItWorks}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Perfect For Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  💡 Perfect For:
                </h3>
                <p className="text-slate-400">
                  See how neural marketing transforms different business types
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {perfectForExamples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-slate-700/30 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 text-center hover:bg-slate-700/40 transition-all duration-300"
                  >
                    <div className="text-3xl mb-4">
                      {example.emoji}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{example.business}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{example.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center p-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your Marketing with AI?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Let our neural networks analyze your audience, predict their behavior, and create 
                marketing campaigns that optimize themselves for maximum ROI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-500/30 to-blue-500/30 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-emerald-500/20"
                >
                  Start Neural Marketing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-slate-600/30 text-slate-300 px-8 py-3 rounded-xl font-medium hover:bg-slate-700/30 hover:text-white transition-all duration-300"
                >
                  View Case Studies
                </motion.button>
              </div>
            </motion.div>

            {/* Neural Animation Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-3xl">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {Array.from({ length: 15 }, (_, i) => (
                  <motion.circle
                    key={i}
                    cx={10 + (i % 5) * 20}
                    cy={15 + Math.floor(i / 5) * 25}
                    r="1.2"
                    fill="url(#marketingGradient)"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.6, 1]
                    }}
                    transition={{
                      duration: 2.2,
                      delay: i * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                <defs>
                  <linearGradient id="marketingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#3b82f6" />
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

export default NeuralMarketingModal;