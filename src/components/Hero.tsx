import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, Zap, Cpu, Network } from 'lucide-react';
import StartProjectModal from './StartProjectModal';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Neural network animation points
  const neuralPoints = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Neural Network Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Neural connections */}
            {neuralPoints.map((point, index) => (
              <g key={point.id}>
                {neuralPoints.slice(index + 1).map((targetPoint, targetIndex) => {
                  const distance = Math.sqrt(
                    Math.pow(targetPoint.x - point.x, 2) + Math.pow(targetPoint.y - point.y, 2)
                  );
                  if (distance < 25) {
                    return (
                      <motion.line
                        key={`${point.id}-${targetPoint.id}`}
                        x1={point.x}
                        y1={point.y}
                        x2={targetPoint.x}
                        y2={targetPoint.y}
                        stroke="url(#neuralGradient)"
                        strokeWidth="0.1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: [0, 1, 0], 
                          opacity: [0, 0.6, 0] 
                        }}
                        transition={{
                          duration: 3,
                          delay: point.delay + targetIndex * 0.1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                    );
                  }
                  return null;
                })}
                {/* Neural nodes */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="0.3"
                  fill="url(#nodeGradient)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1], 
                    opacity: [0, 1, 0.8] 
                  }}
                  transition={{
                    duration: 2,
                    delay: point.delay,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </g>
            ))}
            
            {/* Gradients */}
            <defs>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
              <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[Brain, Cpu, Network, Zap].map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute text-purple-400/20"
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + index * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            >
              <Icon size={40 + index * 10} />
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl mb-8"
            >
              <Brain className="text-purple-400" size={40} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
          >
            Neural-Powered{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Digital Solutions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Transform your business with AI-powered websites, intelligent marketing, 
            and neural design systems that adapt and evolve with your needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="group bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 backdrop-blur-xl border border-purple-500/20 flex items-center space-x-3"
            >
              <Sparkles className="group-hover:rotate-12 transition-transform duration-300" size={20} />
              <span>Start Neural Assembly</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-slate-600/30 text-slate-300 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800/30 hover:text-white transition-all duration-300"
            >
              Explore Intelligence
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: 'Neural Networks Deployed', value: '50+' },
              { label: 'AI Models Trained', value: '200+' },
              { label: 'Businesses Transformed', value: '100+' },
              { label: 'Intelligence Quotient', value: '∞' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.1, type: "spring" }}
                  className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-slate-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Start Project Modal */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Hero;