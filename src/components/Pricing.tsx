import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Zap, Brain, Smartphone, TrendingUp, Shield, Settings } from 'lucide-react';
import CheckoutButton from './checkout/CheckoutButton';
import StartProjectModal from './StartProjectModal';
import { PlanType } from '../lib/stripe';

const coreServices = [
  {
    name: 'Initial Consultation',
    description: '30–45 minute session to define goals, pages, and AI features',
    price: 50,
    category: 'consultation'
  },
  {
    name: 'Landing Page Design',
    description: 'Custom AI-generated or manually designed landing page',
    price: 150,
    category: 'design'
  },
  {
    name: 'Multi-Page Website',
    description: 'Includes Home, About, Services, Contact, Blog (Up to 5 pages)',
    price: 400,
    priceRange: '300-500',
    category: 'development'
  },
  {
    name: 'Blog Integration',
    description: 'AI-assisted blog setup (CMS or static)',
    price: 100,
    category: 'features'
  },
  {
    name: 'AI Chatbot Integration',
    description: 'Includes ChatGPT or other AI agent embed & setup',
    price: 185,
    priceRange: '120-250',
    category: 'ai'
  },
  {
    name: 'SEO Optimization (Basic)',
    description: 'Meta tags, descriptions, keywords, and structure',
    price: 80,
    category: 'optimization'
  },
  {
    name: 'Mobile Optimization',
    description: 'Responsive design tuning for all devices',
    price: 100,
    category: 'optimization'
  },
  {
    name: 'E-Commerce Store Setup',
    description: 'Shopify, Stripe, or Snipcart integration (up to 10 products)',
    price: 325,
    priceRange: '250-400',
    category: 'ecommerce'
  },
  {
    name: 'Booking/Appointment System',
    description: 'Calendly, TidyCal, or AI-powered forms',
    price: 100,
    category: 'features'
  },
  {
    name: 'Performance Monitoring Setup',
    description: 'Add AI agent to analyze load speed, uptime, and bottlenecks',
    price: 120,
    category: 'monitoring'
  },
  {
    name: 'Hosting & Deployment',
    description: 'Deploy to Netlify, Vercel, or Render',
    price: 80,
    category: 'deployment'
  },
  {
    name: 'Custom AI Tool',
    description: 'Functional AI script added to site (with prompt)',
    price: 200,
    priceRange: '200+',
    category: 'ai'
  },
  {
    name: 'Ongoing Maintenance',
    description: 'Bug fixes, updates, and prompt tuning',
    price: 112,
    priceRange: '75-150/month',
    category: 'maintenance',
    isMonthly: true
  }
];

const addOns = [
  {
    name: 'Logo Design (AI-assisted)',
    price: 80,
    priceRange: '60-100'
  },
  {
    name: 'Brand Color Palette & Fonts',
    price: 40
  },
  {
    name: 'Social Media Feed Embed',
    price: 50
  },
  {
    name: 'Image & Copy Generation (AI)',
    price: 100,
    priceRange: '50-150'
  },
  {
    name: 'Custom Domain Setup',
    price: 30
  },
  {
    name: 'Analytics Setup (GA4 + Heatmap tools)',
    price: 80
  }
];

const packages = [
  {
    name: 'Startup Bundle',
    price: 500,
    description: 'Perfect for new businesses getting started',
    features: [
      'Home + About + Services + Contact + Blog',
      'Mobile-ready responsive design',
      'Basic SEO optimization',
      'Initial consultation included',
      'Hosting & deployment'
    ],
    popular: false,
    color: 'blue',
    icon: Zap
  },
  {
    name: 'Smart Business AI Bundle',
    price: 950,
    description: 'Ideal for businesses wanting AI-powered features',
    features: [
      'Everything in Startup Bundle',
      'AI Chatbot integration',
      'Performance AI monitoring',
      'Booking/appointment system',
      'Custom AI tool included',
      'Priority support'
    ],
    popular: true,
    color: 'purple',
    icon: Brain
  },
  {
    name: 'Enterprise Neural Suite',
    price: 1850,
    description: 'Complete AI-powered business solution',
    features: [
      'Everything in Smart Business Bundle',
      'E-commerce store setup',
      'Advanced AI integrations',
      'Custom brand package',
      'Analytics & monitoring suite',
      '3 months maintenance included'
    ],
    popular: false,
    color: 'emerald',
    icon: TrendingUp
  }
];

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddOns, setShowAddOns] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Services', icon: Settings },
    { id: 'ai', label: 'AI Features', icon: Brain },
    { id: 'development', label: 'Development', icon: Smartphone },
    { id: 'optimization', label: 'Optimization', icon: TrendingUp },
    { id: 'features', label: 'Features', icon: Zap }
  ];

  const filteredServices = activeCategory === 'all' 
    ? coreServices 
    : coreServices.filter(service => service.category === activeCategory);

  return (
    <section id="pricing" className="py-32 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI Website Development{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Transparent, moderately-priced AI-powered solutions. Build intelligent websites that adapt and evolve.
          </p>
        </motion.div>

        {/* Package Bundles */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Suggested Starter Packages</h3>
            <p className="text-slate-400">Complete solutions designed for different business needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`relative bg-slate-800/50 backdrop-blur-xl border rounded-3xl p-8 hover:bg-slate-800/70 transition-all duration-300 ${
                  pkg.popular 
                    ? 'border-purple-500/50 ring-2 ring-purple-500/20' 
                    : 'border-slate-700/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star size={14} />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${pkg.color}-500/20 to-${pkg.color}-600/20 border border-${pkg.color}-500/30 rounded-2xl mb-6`}>
                    <pkg.icon className={`text-${pkg.color}-400`} size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-slate-400 mb-4">
                    {pkg.description}
                  </p>
                  <div className="text-4xl font-bold text-white mb-2">
                    ${pkg.price.toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-sm">
                    One-time payment
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
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
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white hover:shadow-2xl border border-purple-500/20'
                      : 'border-2 border-slate-600/30 text-white hover:bg-slate-800/30'
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Individual Services */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Individual Services</h3>
            <p className="text-slate-400">Build your custom solution with individual components</p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/20'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 border border-slate-700/50'
                }`}
              >
                <category.icon size={16} />
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">{service.name}</h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      ${service.priceRange || service.price}
                      {service.isMonthly && <span className="text-sm text-slate-400">/mo</span>}
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300`}>
                  {service.category}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add-ons Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">💡 Optional Add-ons</h3>
            <p className="text-slate-400">Enhance your website with additional features</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowAddOns(!showAddOns)}
            className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-left hover:bg-slate-800/70 transition-all duration-300 mb-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-white">View Add-on Services</span>
              <motion.div
                animate={{ rotate: showAddOns ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="text-purple-400" size={24} />
              </motion.div>
            </div>
          </motion.button>

          <motion.div
            initial={false}
            animate={{
              height: showAddOns ? "auto" : 0,
              opacity: showAddOns ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                    className="w-full"
                    <span className="text-lg font-bold text-pink-400">
                    <CheckoutButton
                      planType={
                        pkg.name === 'Startup Bundle' ? 'startup' :
                        pkg.name === 'Smart Business AI Bundle' ? 'smart_business' :
                        'enterprise'
                      }
                      variant={pkg.popular ? 'primary' : 'secondary'}
                      className="w-full"
                      additionalMetadata={{
                        source: 'pricing_page',
                        package_type: 'bundle'
                      }}
                    >
                      Get Started
                    </CheckoutButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Custom Quote CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need something custom?
            </h3>
            <p className="text-slate-400 mb-6">
              We offer custom AI solutions tailored to your specific requirements. 
              Let's discuss your project and create a personalized neural-powered solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 border border-purple-500/20"
              >
                Get Custom Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-purple-500/30 text-purple-400 px-8 py-4 rounded-full font-semibold hover:bg-purple-500/10 hover:text-white transition-all duration-300"
              >
                Schedule Consultation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Start Project Modal */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Pricing;