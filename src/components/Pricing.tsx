import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$2,999',
    description: 'Perfect for small businesses and startups',
    features: [
      '5-page responsive website',
      'Basic SEO optimization',
      'Contact form integration',
      'Mobile-friendly design',
      '30 days support',
      'Basic analytics setup'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$5,999',
    description: 'Ideal for growing businesses',
    features: [
      '10-page responsive website',
      'Advanced SEO optimization',
      'E-commerce functionality',
      'Custom design elements',
      'Social media integration',
      '90 days support',
      'Advanced analytics',
      'Content management system'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$12,999',
    description: 'For large businesses and corporations',
    features: [
      'Unlimited pages',
      'Custom web application',
      'Advanced integrations',
      'Multi-language support',
      'Custom admin panel',
      '1 year support',
      'Performance optimization',
      'Security enhancements',
      'Training & documentation'
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Transparent pricing with no hidden fees. Choose the package that fits your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`relative bg-slate-800/50 backdrop-blur-xl border rounded-3xl p-8 hover:bg-slate-800/70 transition-all duration-300 ${
                plan.popular 
                  ? 'border-purple-500/50 ring-2 ring-purple-500/20' 
                  : 'border-slate-700/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star size={14} />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-400 mb-4">
                  {plan.description}
                </p>
                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}
                </div>
                <div className="text-slate-400 text-sm">
                  One-time payment
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl'
                    : 'border-2 border-slate-600 text-white hover:bg-slate-800'
                }`}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need something custom?
            </h3>
            <p className="text-slate-400 mb-6">
              We offer custom solutions tailored to your specific requirements. 
              Let's discuss your project and create a personalized quote.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-purple-500 text-purple-400 px-8 py-4 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300"
            >
              Contact for Custom Quote
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;