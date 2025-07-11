import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Lightbulb, Code, Rocket } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import StartProjectModal from './StartProjectModal';

const Process = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getContentSection } = useContent();
  
  // Get process steps from CMS
  const processContent = getContentSection('process_steps')?.content || { steps: [] };
  
  // Icon mapping for process steps
  const iconMap: Record<string, any> = {
    'Neural Discovery': MessageSquare,
    'Adaptive Strategy': Lightbulb,
    'Intelligent Development': Code,
    'Smart Launch': Rocket
  };
  
  // Use CMS content or fallback to default
  const processSteps = processContent.steps.length > 0 ? processContent.steps : [
    {
      title: 'Neural Discovery',
      description: 'AI-powered analysis of your business, goals, and market intelligence.',
      details: ['Smart consultation', 'AI requirements gathering', 'Neural market research', 'Intelligent competitor analysis']
    },
    {
      title: 'Adaptive Strategy',
      description: 'Machine learning algorithms develop personalized strategies for your needs.',
      details: ['AI project planning', 'Neural design concepts', 'Smart architecture', 'Predictive timeline creation']
    },
    {
      title: 'Intelligent Development',
      description: 'Our neural network brings your vision to life with self-optimizing code.',
      details: ['AI-assisted implementation', 'Smart development sprints', 'Neural quality assurance', 'Adaptive client feedback']
    },
    {
      title: 'Smart Launch',
      description: 'Automated deployment with continuous learning and intelligent optimization.',
      details: ['Neural testing', 'Smart deployment', 'AI training & handover', 'Continuous learning support']
    }
  ];

  return (
    <>
      <section id="process" className="relative py-32 bg-gradient-to-br from-slate-800 to-slate-900">
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
                Process
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our AI-powered methodology delivers intelligent solutions with neural precision.
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transform -translate-y-1/2 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                (() => {
                  const IconComponent = iconMap[step.title] || MessageSquare;
                  return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 hidden lg:flex">
                    {index + 1}
                  </div>

                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-8 text-center hover:bg-slate-700/80 transition-all duration-300 mt-8 lg:mt-0 shadow-xl"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl mb-6"
                    >
                      <IconComponent className="text-purple-400" size={32} />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-4">
                      {step.title}
                    </h3>

                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                          <span className="text-slate-300 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
                  );
                })()
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-20"
          >
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-600/60 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to build something intelligent?
              </h3>
              <p className="text-slate-300 mb-6">
                Let our neural network assemble the perfect digital solution for your vision.
              </p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 backdrop-blur-xl border border-purple-500/20"
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
    </>
  );
};

export default Process;