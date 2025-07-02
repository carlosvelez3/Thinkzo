import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Services': [
      'Website Design',
      'Web Development',
      'Digital Marketing',
      'Brand Identity',
      'SEO Optimization',
      'Analytics & Insights'
    ],
    'Company': [
      'About Us',
      'Our Team',
      'Careers',
      'Blog',
      'Case Studies',
      'Contact'
    ],
    'Resources': [
      'Design Process',
      'Development Guide',
      'Marketing Tips',
      'Brand Guidelines',
      'Free Consultation',
      'Support Center'
    ]
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Palette className="text-white" size={20} />
              </div>
              <span className="text-white font-bold text-xl">Thinkzo</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-md">
              We're a creative digital agency specializing in website design, 
              development, and marketing solutions that help businesses thrive online.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-slate-400">
                <Mail size={16} />
                <span>team@thinkzo.ai</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <MapPin size={16} />
                <span>123 Design Street, Creative City</span>
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
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
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
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;