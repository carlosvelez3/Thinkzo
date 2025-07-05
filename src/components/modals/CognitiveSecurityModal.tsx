import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Eye, Settings, Zap } from 'lucide-react';

interface CognitiveSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CognitiveSecurityModal: React.FC<CognitiveSecurityModalProps> = ({ isOpen, onClose }) => {
  const securityFeatures = [
    {
      title: 'Threat Prediction',
      definition: 'AI models trained to anticipate cyber threats before they occur by analyzing historical attack patterns, user behavior, and real-time traffic anomalies.',
      features: [
        'Predict phishing attempts or credential stuffing attacks',
        'Preemptively detect shadow IT usage or unsecured APIs',
        'Risk scoring for new devices or IPs trying to access your system'
      ],
      whyItMatters: 'Stops threats before they escalate—unlike traditional detection-only systems.',
      color: 'red',
      icon: Eye
    },
    {
      title: 'Adaptive Defense',
      definition: 'Security systems that reconfigure firewalls, access rules, and protections dynamically based on evolving threats or behavior.',
      features: [
        'User access levels adjust automatically during high-risk activity',
        'AI can block specific behaviors without blocking the user',
        'System hardening based on global attack intelligence (zero-day awareness)'
      ],
      whyItMatters: 'Your defense layer evolves in real time—tailored to the situation.',
      color: 'orange',
      icon: Settings
    },
    {
      title: 'Smart Monitoring',
      definition: 'AI observes network and application activity to detect anomalies, often missed by traditional systems.',
      features: [
        'Real-time behavior-based threat detection (not just signature-based)',
        'AI learns "normal" for your system, then flags outliers (e.g., a user downloading 1GB at 2AM)',
        'Full-stack observability: endpoints, APIs, databases, cloud'
      ],
      whyItMatters: 'Reduces false positives and finds real threats fast.',
      color: 'blue',
      icon: Eye
    },
    {
      title: 'Auto-Response',
      definition: 'AI takes immediate action against identified threats without human intervention—minimizing damage or breach impact.',
      features: [
        'Quarantines compromised accounts, devices, or sessions instantly',
        'Sends real-time alerts with a recommended action path',
        'Rolls back unauthorized changes (e.g., file or DB modifications)'
      ],
      whyItMatters: 'You contain the breach in seconds—not hours or days.',
      color: 'emerald',
      icon: Zap
    }
  ];

  const whyCognitiveSecurity = [
    'Traditional firewalls and rule-based systems can\'t keep up with AI-driven threats.',
    'Human-led monitoring is too slow and expensive for 24/7 coverage.',
    'Cognitive systems create a self-improving feedback loop—the more attacks they face, the smarter they become.'
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
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center">
                  <Shield className="text-orange-400" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Cognitive{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Security
                  </span>
                </h2>
              </div>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-6">
                AI-driven cybersecurity systems that continuously learn, adapt, and respond to threats—turning 
                defense from reactive to proactive and predictive.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {securityFeatures.map((feature, index) => (
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
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-2 flex-shrink-0" />
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

            {/* Why Cognitive Security Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12 bg-slate-700/20 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Why Cognitive Security Is the Future:
              </h3>
              <div className="space-y-4">
                {whyCognitiveSecurity.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-slate-300 leading-relaxed">{reason}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center p-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Secure Your Future with AI?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Let our cognitive security systems learn your environment, predict threats, and protect 
                your digital assets with intelligent, adaptive defense mechanisms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500/30 to-red-500/30 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-orange-500/20"
                >
                  Start Security Assessment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-slate-600/30 text-slate-300 px-8 py-3 rounded-xl font-medium hover:bg-slate-700/30 hover:text-white transition-all duration-300"
                >
                  View Security Demo
                </motion.button>
              </div>
            </motion.div>

            {/* Neural Animation Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-3xl">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.circle
                    key={i}
                    cx={15 + (i % 4) * 25}
                    cy={20 + Math.floor(i / 4) * 25}
                    r="1.5"
                    fill="url(#securityGradient)"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.8, 1]
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
                  <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
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

export default CognitiveSecurityModal;