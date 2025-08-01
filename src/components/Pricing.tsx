import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star, Zap, Brain, Rocket } from 'lucide-react';
import StartProjectModal from './StartProjectModal';

const Pricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingTiers = [
    {
      name: 'Startup Bundle',
      description: 'Perfect for new businesses getting started',
      monthlyPrice: 99,
      yearlyPrice: 990,
      originalPrice: 500,
      features: [
        '5-page responsive website',
        'Basic AI features',
        'Mobile optimization',
        'SEO foundation',
        'Contact form integration',
        '1 month support',
        'Basic analytics setup'
      ],
      color: 'blue',
      icon: Rocket,
      popular: false
    },
    {
      name: 'Smart Business AI Bundle',
      description: 'Most popular - Everything you need to grow',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      originalPrice: 950,
      features: [
        'Everything in Startup Bundle',
        'AI chatbot integration',
        'Performance monitoring',
        'Booking system',
        'Advanced analytics',
        'E-commerce ready',
        '3 months support',
        'Priority support'
      ],
      color: 'purple',
      icon: Brain,
      popular: true
    },
    {
      name: 'Enterprise Neural Suite',
      description: 'Complete AI-powered business solution',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      originalPrice: 1850,
      features: [
        'Everything in Smart Business',
        'Advanced AI integrations',
        'Custom neural features',
        'Multi-language support',
        'Advanced security',
        'Custom integrations',
        '6 months maintenance',
        'Dedicated account manager'
      ],
      color: 'emerald',
      icon: Zap,
      popular: false
    }
  ];

  const getPrice = (tier: any) => {
    return billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
  };

  const getSavings = (tier: any) => {
    const monthlyTotal = tier.monthlyPrice * 12;
    const yearlyPrice = tier.yearlyPrice;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <>
      <section id="pricing" className="py-32 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
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
                Pricing
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Choose the perfect AI-powered solution for your business. All plans include our neural intelligence technology.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                Monthly
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                  billingCycle === 'yearly' ? 'bg-purple-500' : 'bg-slate-600'
                }`}
              >
                <motion.div
                  animate={{ x: billingCycle === 'yearly' ? 32 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </motion.button>
              <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Save up to 20%
                </span>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-slate-800/50 backdrop-blur-xl border rounded-3xl p-8 hover:bg-slate-800/70 transition-all duration-300 ${
                  tier.popular 
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10' 
                    : 'border-slate-700/50'
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                      <Star size={16} />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${tier.color}-500/20 to-${tier.color}-600/20 border border-${tier.color}-500/30 rounded-2xl mb-6`}
                >
                  <tier.icon className={`text-${tier.color}-400`} size={32} />
                </motion.div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-slate-400 mb-6">{tier.description}</p>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-4xl font-bold text-white">
                      ${getPrice(tier)}
                    </span>
                    <span className="text-slate-400">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <div className="text-green-400 text-sm font-medium">
                      Save ${getSavings(tier)} per year
                    </div>
                  )}
                  
                  <div className="text-slate-500 text-sm mt-2">
                    One-time option: ${tier.originalPrice}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full bg-${tier.color}-500/20 border border-${tier.color}-500/30 flex items-center justify-center flex-shrink-0`}>
                        <Check className={`text-${tier.color}-400`} size={12} />
                      </div>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/8'
                      : 'bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-700/70'
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </motion.button>

                {/* Additional Info */}
                <div className="mt-4 text-center">
                  <p className="text-slate-500 text-xs">
                    No setup fees • Cancel anytime • 30-day money-back guarantee
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Solutions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-20"
          >
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-600/60 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-slate-300 mb-6">
                Our neural networks can create completely custom AI-powered solutions tailored to your unique business needs.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 backdrop-blur-xl border border-purple-500/20"
              >
                Get Custom Quote
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

export default Pricing;