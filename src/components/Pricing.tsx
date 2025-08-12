import React, { useState } from 'react';
import { useEffect } from 'react';
import { Check, Star } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import TypewriterText from './TypewriterText';

const Pricing: React.FC = () => {
  const [billingType, setBillingType] = useState<'onetime' | 'monthly'>('onetime');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    // Create and inject the IOTA-style synchronized squares animation for pricing section
    const style = document.createElement('style');
    style.textContent = `
      .pricing-iota-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0b1220 0%, #111833 50%, #0b1220 100%);
        overflow: hidden;
      }

      .pricing-iota-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(6, 1fr);
        gap: 3px;
        padding: 30px;
        opacity: 0.4;
      }

      .pricing-iota-square {
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(91, 140, 255, 0.06);
        border: 1px solid rgba(91, 140, 255, 0.12);
        border-radius: 12px;
        backdrop-filter: blur(1px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        animation: pricingIotaWave 10s ease-in-out infinite;
      }

      .pricing-iota-square::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(91, 140, 255, 0.08), transparent);
        border-radius: 12px;
        opacity: 0;
        transition: opacity 0.8s ease;
      }

      .pricing-iota-square.active::before {
        opacity: 1;
      }

      .pricing-iota-square.active {
        background: rgba(91, 140, 255, 0.12);
        border-color: rgba(91, 140, 255, 0.25);
        box-shadow: 0 0 20px rgba(91, 140, 255, 0.15);
        transform: scale(1.08);
      }

      .pricing-iota-square.pulse {
        animation: pricingIotaPulse 3s ease-in-out infinite;
      }

      .pricing-ambient-glow {
        position: absolute;
        top: 15%;
        left: 15%;
        width: 70%;
        height: 70%;
        background: radial-gradient(circle, rgba(91, 140, 255, 0.04) 0%, transparent 70%);
        border-radius: 50%;
        animation: pricingAmbientGlow 15s ease-in-out infinite;
      }

      /* Synchronized wave animation for pricing */
      @keyframes pricingIotaWave {
        0%, 100% { 
          transform: scale(1) translateY(0);
          opacity: 0.5;
        }
        25% { 
          transform: scale(1.03) translateY(-3px);
          opacity: 0.7;
        }
        50% { 
          transform: scale(1.06) translateY(-6px);
          opacity: 0.9;
        }
        75% { 
          transform: scale(1.03) translateY(-3px);
          opacity: 0.7;
        }
      }

      @keyframes pricingIotaPulse {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 0 20px rgba(91, 140, 255, 0.15);
        }
        50% { 
          transform: scale(1.12);
          box-shadow: 0 0 30px rgba(91, 140, 255, 0.3);
        }
      }

      @keyframes pricingAmbientGlow {
        0%, 100% { 
          opacity: 0.4;
          transform: scale(1);
        }
        50% { 
          opacity: 0.7;
          transform: scale(1.15);
        }
      }

      /* Responsive grid adjustments for pricing */
      @media (max-width: 768px) {
        .pricing-iota-grid {
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(10, 1fr);
          padding: 20px;
        }
      }

      @media (max-width: 480px) {
        .pricing-iota-grid {
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(15, 1fr);
          padding: 15px;
        }
      }

      /* Center safe area - keep clean for content */
      .pricing-iota-square:nth-child(n+13):nth-child(-n+48) {
        opacity: 0.2;
        animation-duration: 15s;
      }
    `;
    document.head.appendChild(style);

    // Create IOTA-style synchronized grid for pricing
    const createPricingIotaGrid = () => {
      const grid = document.getElementById('pricing-iota-grid');
      if (!grid) return;

      // Clear existing squares
      grid.innerHTML = '';

      // Calculate grid size based on screen size
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      
      let cols, rows;
      if (isSmallMobile) {
        cols = 4; rows = 15;
      } else if (isMobile) {
        cols = 6; rows = 10;
      } else {
        cols = 10; rows = 6;
      }

      const totalSquares = cols * rows;

      // Create squares
      for (let i = 0; i < totalSquares; i++) {
        const square = document.createElement('div');
        square.className = 'pricing-iota-square';
        
        // Calculate position in grid
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        // Create diagonal wave effect with staggered delays
        const diagonalIndex = row + col;
        const delay = (diagonalIndex * 0.15) % 10; // 10-second cycle
        
        square.style.animationDelay = `${delay}s`;
        
        // Add special effects to some squares
        if (Math.random() < 0.12) {
          square.classList.add('pulse');
          square.style.animationDelay = `${delay + Math.random() * 3}s`;
        }
        
        grid.appendChild(square);
      }
    };

    // Synchronized wave activation for pricing
    const activatePricingWaves = () => {
      const squares = document.querySelectorAll('.pricing-iota-square');
      
      setInterval(() => {
        // Create diagonal wave pattern
        squares.forEach((square, index) => {
          const cols = window.innerWidth <= 480 ? 4 : window.innerWidth <= 768 ? 6 : 10;
          const row = Math.floor(index / cols);
          const col = index % cols;
          const diagonalIndex = row + col;
          
          setTimeout(() => {
            square.classList.add('active');
            setTimeout(() => {
              square.classList.remove('active');
            }, 1200);
          }, diagonalIndex * 120);
        });
      }, 10000); // 10-second cycle
    };

    // Initialize pricing IOTA animation
    setTimeout(() => {
      createPricingIotaGrid();
      activatePricingWaves();
    }, 100);

    // Handle window resize
    const handleResize = () => {
      createPricingIotaGrid();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const plans = [
    {
      name: 'Starter Launchpad',
      subtitle: '1-Page AI Website (Home)',
      description: 'Perfect for getting your business online quickly',
      features: [
        'Mobile-Optimized + SSL',
        'Contact Form + Email Notifications',
        'Hosting Setup Included',
        'Basic SEO Tags',
        '5 Free Stock Images'
      ],
      oneTimePrice: '$295',
      monthlyPrice: '$49',
      monthlyDuration: '6 months',
      setupFee: '$25',
      popular: false,
      stripePriceIds: {
        onetime: 'price_1QdVGJP123456789abcdef01', // TODO: Replace with your actual Stripe Price ID
        monthly: 'price_1QdVGKP123456789abcdef02'   // TODO: Replace with your actual Stripe Price ID
      }
    },
    {
      name: 'Growth Optimizer',
      subtitle: '3–5 Page AI Website',
      description: 'Ideal for growing businesses and teams',
      features: [
        'Smart Forms with Auto Replies',
        'Keyword SEO Setup',
        'Logo + Color Matching',
        'Up to 15 Images',
        'Blog or Services Page'
      ],
      oneTimePrice: '$798',
      monthlyPrice: '$133',
      monthlyDuration: '6 months',
      setupFee: '$25',
      popular: true,
      stripePriceIds: {
        onetime: 'price_1QdVGLP123456789abcdef03', // TODO: Replace with your actual Stripe Price ID
        monthly: 'price_1QdVGMP123456789abcdef04'   // TODO: Replace with your actual Stripe Price ID
      }
    },
    {
      name: 'Elite Automator',
      subtitle: 'Up to 10 Pages Fully Designed',
      description: 'Fully Customizable Site for Your Enterprise Needs',
      features: [
        'AI Chat Agent + Lead Capture',
        'Speed Optimized + SEO Indexing',
        'Full Brand Integration',
        'Human + AI Hybrid Copy',
        'Perfect for growing businesses or enterprises needing a powerful, custom-designed web solution built to scale.'
      ],
      oneTimePrice: 'Custom',
      monthlyPrice: 'Custom',
      monthlyDuration: '6 months',
      setupFee: '$25',
      popular: false,
      stripePriceIds: null // Custom pricing - handle via contact form
    }
  ];

  const handleChoosePlan = async (plan: typeof plans[0]) => {
    // Handle custom pricing plans via contact form
    if (plan.name === 'Elite Automator' || plan.name === 'Starter Launchpad' || plan.name === 'Growth Optimizer' || !plan.stripePriceIds) {
      scrollToContact();
      return;
    }

    // Handle Stripe checkout for standard plans
    try {
      setLoadingPlan(plan.name);
      
      const priceId = billingType === 'onetime' 
        ? plan.stripePriceIds.onetime 
        : plan.stripePriceIds.monthly;
      
      await createCheckoutSession(priceId, plan.name);
    } catch (_error) {
      console.error('Error creating checkout session:', _error);
      alert('There was an error processing your request. Please try again or contact us directly.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="relative py-20 bg-navy-950 overflow-hidden">
      {/* IOTA-style Synchronized Squares Background */}
      <div className="pricing-iota-bg">
        <div className="pricing-ambient-glow"></div>
        <div className="pricing-iota-grid" id="pricing-iota-grid">
          {/* Squares will be generated dynamically */}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-poppins text-white mb-6 tracking-tight">
            AI Website{' '}
            <span className="gradient-text">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            <TypewriterText 
              text="Professional AI-powered websites designed to grow your business and convert visitors into customers."
              speed={35}
              delay={2000}
            />
          </p>
          
          {/* Crypto Payment Banner */}
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 border border-cyan-400/30 rounded-xl p-4 mb-8 backdrop-blur-sm">
            <p className="text-cyan-400 font-semibold text-lg">
              🚀 <span className="gradient-text">Now Accepting Crypto Payments!</span> For added flexibility and security, you can now pay for our services using your preferred cryptocurrency. Embrace the future of payments with Thinkzo.ai!
            </p>
          </div>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-navy-800/50 backdrop-blur-sm rounded-lg p-1 border border-navy-700">
              <button
                onClick={() => setBillingType('onetime')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  billingType === 'onetime'
                    ? 'bg-gradient-to-r from-purple-400/90 via-pink-400/90 to-cyan-400/90 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                One-time Payment
              </button>
              <button
                onClick={() => setBillingType('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  billingType === 'monthly'
                    ? 'bg-gradient-to-r from-purple-400/90 via-pink-400/90 to-cyan-400/90 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly Payment
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-navy-800/50 backdrop-blur-sm rounded-xl p-8 border transition-all duration-300 ${
                plan.popular 
                  ? 'border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105' 
                  : 'border-navy-700 card-hover'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-400/90 via-pink-400/90 to-cyan-400/90 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={16} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold font-poppins text-white mb-2 tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-cyan-400 text-lg font-medium mb-2">{plan.subtitle}</p>
                <p className="text-gray-400 mb-6 font-light">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-white tracking-tight">
                      {billingType === 'onetime' ? plan.oneTimePrice : plan.monthlyPrice}
                    </span>
                    {billingType === 'monthly' && (
                      <span className="text-gray-400 ml-1 font-light">/{plan.monthlyDuration}</span>
                    )}
                  </div>
                  {billingType === 'onetime' && (
                    <p className="text-sm text-gray-400">One-time payment</p>
                  )}
                  {billingType === 'monthly' && (
                    <p className="text-sm text-gray-400">6 monthly payments</p>
                  )}
                </div>
                
                <div className="text-sm text-gray-400 mb-4">
                  Setup Fee: <span className="text-cyan-400 font-medium">{plan.setupFee}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleChoosePlan(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-400/90 via-pink-400/90 to-cyan-400/90 hover:from-purple-500/90 hover:via-pink-500/90 hover:to-cyan-500/90 text-white transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm'
                    : 'bg-navy-800/90 hover:bg-navy-700/90 text-white border border-navy-600/90 hover:border-cyan-400/90 backdrop-blur-sm'
                } ${loadingPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingPlan === plan.name ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <h4 className="text-lg font-semibold text-white mb-2">Hosting & Domain Support</h4>
          <p className="text-gray-300 font-light mb-6">
            Professional hosting and domain management available
          </p>
          
          {/* Hosting Company Logos */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-4">Trusted Hosting and Domain Partners:</p>
            <div className="overflow-hidden">
              <div className="flex animate-scroll-right-to-left">
                {/* First set of logos */}
                <div className="flex items-center space-x-8 min-w-max">
                  {/* Bluehost */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-blue-400 font-bold text-lg">Bluehost</span>
                    </div>
                  </div>
                  
                  {/* HostGator */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-yellow-400 font-bold text-lg">HostGator</span>
                    </div>
                  </div>
                  
                  {/* Google Domains */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-blue-400 font-bold text-lg">Google</span>
                      <span className="text-red-400 font-bold text-lg ml-1">Domains</span>
                    </div>
                  </div>
                  
                  {/* IONOS */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-blue-400 font-bold text-lg">IONOS</span>
                    </div>
                  </div>
                  
                  {/* SiteGround */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-green-400 font-bold text-lg">SiteGround</span>
                    </div>
                  </div>
                  
                  {/* Cloudflare */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-orange-400 font-bold text-lg">Cloudflare</span>
                    </div>
                  </div>
                </div>
                
                {/* Duplicate set for seamless loop */}
                <div className="flex items-center space-x-8 min-w-max ml-8">
                  {/* Bluehost */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-blue-400 font-bold text-lg">Bluehost</span>
                    </div>
                  </div>
                  
                  {/* HostGator */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-yellow-400 font-bold text-lg">HostGator</span>
                    </div>
                  </div>
                  
                  {/* Google Domains */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-blue-400 font-bold text-lg">Google</span>
                      <span className="text-red-400 font-bold text-lg ml-1">Domains</span>
                    </div>
                  </div>
                  
                  {/* IONOS */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-blue-400 font-bold text-lg">IONOS</span>
                    </div>
                  </div>
                  
                  {/* SiteGround */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-green-400 font-bold text-lg">SiteGround</span>
                    </div>
                  </div>
                  
                  {/* Cloudflare */}
                  <div className="bg-navy-700/50 p-4 rounded-lg hover:bg-navy-600/50 transition-all duration-300 group">
                    <div className="h-8 flex items-center">
                      <span className="text-orange-400 font-bold text-lg">Cloudflare</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Pricing;