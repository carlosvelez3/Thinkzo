import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bot, Zap, Brain } from 'lucide-react';
import ChatInterface from '../chat/ChatInterface';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 relative">
      {/* Hero Section */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center">
                <MessageCircle className="text-purple-400" size={32} />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                AI{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Assistant
                </span>
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Chat with our AI-powered assistant to learn about our services, get technical support, 
              or explore how neural intelligence can transform your business.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: Bot,
                title: 'Powered by ChatGPT',
                description: 'Advanced AI that understands context and provides intelligent responses',
                color: 'purple'
              },
              {
                icon: Zap,
                title: 'Instant Responses',
                description: 'Get immediate answers to questions about our services and solutions',
                color: 'pink'
              },
              {
                icon: Brain,
                title: 'Neural Intelligence',
                description: 'Learn how AI can transform your business with personalized insights',
                color: 'blue'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center"
              >
                <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 border border-${feature.color}-500/30 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`text-${feature.color}-400`} size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="pb-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ChatInterface fullScreen={false} />
          </motion.div>
        </div>
      </section>

      {/* Neural Animation Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {Array.from({ length: 15 }, (_, i) => (
            <motion.circle
              key={i}
              cx={10 + (i % 5) * 20}
              cy={15 + Math.floor(i / 5) * 25}
              r="1"
              fill="url(#chatGradient)"
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
            <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default ChatPage;