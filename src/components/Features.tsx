import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Rocket } from 'lucide-react';
import TypewriterText from './TypewriterText';

const Features: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Start animation slightly before fully visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Neural Insights',
      description: 'Harness the power of advanced AI algorithms to extract meaningful insights from your data and make informed decisions with confidence.',
      iconColor: 'from-purple-500 to-purple-400',
      glowColor: 'purple-500',
      animationDelay: '0s'
    },
    {
      icon: Zap,
      title: 'Automation Tools',
      description: 'Streamline your workflows with intelligent automation that adapts to your business needs and scales with your growth.',
      iconColor: 'from-yellow-500 to-orange-400',
      glowColor: 'yellow-500',
      animationDelay: '0.2s'
    },
    {
      icon: Rocket,
      title: 'Scalable SaaS',
      description: 'Built for enterprise-grade performance with cloud-native architecture that grows seamlessly with your business demands.',
      iconColor: 'from-cyan-500 to-cyan-400',
      glowColor: 'cyan-500',
      animationDelay: '0.4s'
    }
  ];

  return (
    <section id="features" className="py-20 bg-navy-900" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-poppins text-white mb-6 tracking-tight">
            Powerful{' '}
            <span className="gradient-text">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            <TypewriterText 
              text="Discover the cutting-edge capabilities that make Thinkzo.ai the perfect choice for your AI-powered applications."
              speed={30}
              delay={1500}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-navy-800/50 backdrop-blur-sm rounded-xl p-8 border border-navy-700 card-hover overflow-hidden group"
            >
              {/* Neural Light Effects */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, lightIndex) => (
                  <div
                    key={lightIndex}
                    className={`absolute w-1 h-1 bg-${feature.glowColor} rounded-full opacity-0 animate-neural-flash`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${lightIndex * 0.5}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                      boxShadow: `0 0 10px currentColor, 0 0 20px currentColor`
                    }}
                  />
                ))}
              </div>
              
              {/* Pulsing Border Effect */}
              <div className={`absolute inset-0 rounded-xl border-2 border-${feature.glowColor}/20 animate-pulse-border opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`relative flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.iconColor} rounded-xl mb-6 mx-auto transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg ${
                isVisible ? 'animate-feature-icon-entrance' : 'opacity-0 scale-50'
              }`}
                   style={{
                     boxShadow: `0 0 30px ${feature.glowColor === 'purple-500' ? '#a855f7' : feature.glowColor === 'yellow-500' ? '#eab308' : '#06b6d4'}40`,
                     animationDelay: isVisible ? feature.animationDelay : '0s'
                   }}>
                {/* Icon Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.iconColor} rounded-xl blur-md opacity-50 ${
                  isVisible ? 'animate-pulse-slow' : ''
                }`} />
                <feature.icon size={32} className={`text-white ${
                  isVisible ? 'animate-icon-bounce' : ''
                }`} style={{ animationDelay: isVisible ? `calc(${feature.animationDelay} + 0.3s)` : '0s' }} />
              </div>
              
              <h3 className="text-2xl font-semibold font-poppins text-white mb-4 text-center tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 text-center leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;