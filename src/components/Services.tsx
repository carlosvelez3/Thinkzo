import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Palette, Smartphone, TrendingUp, Shield, Zap } from 'lucide-react';
import StartProjectModal from './StartProjectModal';
import IntelligentBrandingModal from './modals/IntelligentBrandingModal';
import NeuralWebsiteModal from './modals/NeuralWebsiteModal';
import SmartMobileAppsModal from './modals/SmartMobileAppsModal';
import NeuralMarketingModal from './modals/NeuralMarketingModal';
import CognitiveSecurityModal from './modals/CognitiveSecurityModal';
import PerformanceAIModal from './modals/PerformanceAIModal';

const services = [
  {
    icon: Brain,
    title: 'Neural Website Design',
    description: 'AI-powered websites that learn and adapt to your users\' behavior, optimizing conversion rates automatically.',
    features: ['Adaptive UI/UX', 'Smart A/B Testing', 'Behavioral Analytics', 'Auto-optimization'],
    color: 'purple'
  },
  {
    icon: Palette,
    title: 'Intelligent Branding',
    description: 'Machine learning algorithms create brand identities that resonate with your target audience.',
    features: ['AI Logo Generation', 'Color Psychology', 'Brand Voice Analysis', 'Market Positioning'],
    color: 'pink'
  },
  {
    icon: Smartphone,
    title: 'Smart Mobile Apps',
    description: 'Neural-powered mobile applications with predictive features and intelligent user interfaces.',
    features: ['Predictive UX', 'Smart Notifications', 'Adaptive Performance', 'AI Integration'],
    color: 'blue'
  },
  {
    icon: TrendingUp,
    title: 'Neural Marketing',
    description: 'AI-driven marketing campaigns that optimize themselves for maximum ROI and engagement.',
    features: ['Predictive Analytics', 'Smart Targeting', 'Auto-optimization', 'Performance AI'],
    color: 'emerald'
  },
  {
    icon: Shield,
    title: 'Cognitive Security',
    description: 'Advanced AI security systems that learn and adapt to protect your digital assets.',
    features: ['Threat Prediction', 'Adaptive Defense', 'Smart Monitoring', 'Auto-response'],
    color: 'orange'
  },
  {
    icon: Zap,
    title: 'Performance AI',
    description: 'Neural networks that continuously optimize your digital infrastructure for peak performance.',
    features: ['Smart Caching', 'Load Prediction', 'Auto-scaling', 'Performance ML'],
    color: 'lime'
  }
];

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [isCognitiveSecurityModalOpen, setIsCognitiveSecurityModalOpen] = useState(false);
  const [isPerformanceAIModalOpen, setIsPerformanceAIModalOpen] = useState(false);

  return (
    <>
      <section id="services" className="py-32 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Neural{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Harness the power of artificial intelligence to transform your business 
              with our cutting-edge neural solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${service.color}-500/20 to-${service.color}-600/20 border border-${service.color}-500/30 rounded-2xl mb-6`}
                >
                  <service.icon className={`text-${service.color}-400`} size={32} />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (service.title === 'Intelligent Branding') {
                      setIsBrandingModalOpen(true);
                    } else if (service.title === 'Neural Website Design') {
                      setIsWebsiteModalOpen(true);
                    } else if (service.title === 'Smart Mobile Apps') {
                      setIsMobileModalOpen(true);
                    } else if (service.title === 'Neural Marketing') {
                      setIsMarketingModalOpen(true);
                    } else if (service.title === 'Cognitive Security') {
                      setIsCognitiveSecurityModalOpen(true);
                    } else if (service.title === 'Performance AI') {
                      setIsPerformanceAIModalOpen(true);
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white py-3 rounded-xl font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-20"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to evolve your business?
              </h3>
              <p className="text-slate-300 mb-6">
                Let our neural networks analyze your needs and craft the perfect digital solution.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 border border-purple-500/20"
              >
                Start Neural Assembly
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Start Project Modal */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Intelligent Branding Modal */}
      <IntelligentBrandingModal 
        isOpen={isBrandingModalOpen} 
        onClose={() => setIsBrandingModalOpen(false)} 
      />

      {/* Neural Website Design Modal */}
      <NeuralWebsiteModal 
        isOpen={isWebsiteModalOpen} 
        onClose={() => setIsWebsiteModalOpen(false)} 
      />

      {/* Smart Mobile Apps Modal */}
      <SmartMobileAppsModal 
        isOpen={isMobileModalOpen} 
        onClose={() => setIsMobileModalOpen(false)} 
      />

      {/* Neural Marketing Modal */}
      <NeuralMarketingModal 
        isOpen={isMarketingModalOpen} 
        onClose={() => setIsMarketingModalOpen(false)} 
      />

      {/* Cognitive Security Modal */}
      <CognitiveSecurityModal 
        isOpen={isCognitiveSecurityModalOpen} 
        onClose={() => setIsCognitiveSecurityModalOpen(false)} 
      />

      {/* Performance AI Modal */}
      <PerformanceAIModal 
        isOpen={isPerformanceAIModalOpen} 
        onClose={() => setIsPerformanceAIModalOpen(false)} 
      />
    </>
  );
};

export default Services;