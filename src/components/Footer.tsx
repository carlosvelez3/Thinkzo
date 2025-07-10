import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './ui/Logo';
import StartProjectModal from './StartProjectModal';
import IntelligentBrandingModal from './modals/IntelligentBrandingModal';
import NeuralWebsiteModal from './modals/NeuralWebsiteModal';
import SmartMobileAppsModal from './modals/SmartMobileAppsModal';
import NeuralMarketingModal from './modals/NeuralMarketingModal';
import PerformanceAIModal from './modals/PerformanceAIModal';
import PrivacyPolicyModal from './modals/PrivacyPolicyModal';
import TermsOfServiceModal from './modals/TermsOfServiceModal';
import CookiePolicyModal from './modals/CookiePolicyModal';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = React.useState(false);
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = React.useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = React.useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = React.useState(false);
  const [isPerformanceAIModalOpen, setIsPerformanceAIModalOpen] = React.useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = React.useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = React.useState(false);

  const footerLinks = {
    'Services': [
      { name: 'Neural Website Design', action: () => setIsWebsiteModalOpen(true) },
      { name: 'Intelligent Branding', action: () => setIsBrandingModalOpen(true) },
      { name: 'Smart Mobile Apps', action: () => setIsMobileModalOpen(true) },
      { name: 'Neural Marketing', action: () => setIsMarketingModalOpen(true) },
      { name: 'Performance AI', action: () => setIsPerformanceAIModalOpen(true) },
      { name: 'AI Consulting', action: () => setIsModalOpen(true) }
    ],
    'Company': [
      { name: 'About Us', action: null },
      { name: 'Contact', action: null }
    ]
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo variant="full" size="lg" animated={true} />
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-md">
              We're a creative digital agency specializing in website design, 
              development, and marketing solutions that help businesses thrive online.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-slate-400">
                <Mail size={16} />
                <a href="mailto:team@thinkzo.ai" className="hover:text-white transition-colors">
                  team@thinkzo.ai
                </a>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <Phone size={16} />
                <a href="tel:8448446596" className="hover:text-white transition-colors">
                  (844) 844-6596
                </a>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <MapPin size={16} />
                <span>US Services Only</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-slate-700 transition-all duration-300"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    {link.action ? (
                      <button
                        onClick={link.action}
                        className="text-slate-400 hover:text-white transition-colors text-sm text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2024 Thinkzo. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <button 
                onClick={() => setIsPrivacyModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setIsTermsModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => setIsCookieModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Project Modal */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Service Modals */}
      <IntelligentBrandingModal 
        isOpen={isBrandingModalOpen} 
        onClose={() => setIsBrandingModalOpen(false)} 
      />

      <NeuralWebsiteModal 
        isOpen={isWebsiteModalOpen} 
        onClose={() => setIsWebsiteModalOpen(false)} 
      />

      <SmartMobileAppsModal 
        isOpen={isMobileModalOpen} 
        onClose={() => setIsMobileModalOpen(false)} 
      />

      <NeuralMarketingModal 
        isOpen={isMarketingModalOpen} 
        onClose={() => setIsMarketingModalOpen(false)} 
      />

      <PerformanceAIModal 
        isOpen={isPerformanceAIModalOpen} 
        onClose={() => setIsPerformanceAIModalOpen(false)} 
      />

      {/* Legal Policy Modals */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />

      <TermsOfServiceModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />

      <CookiePolicyModal 
        isOpen={isCookieModalOpen} 
        onClose={() => setIsCookieModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;