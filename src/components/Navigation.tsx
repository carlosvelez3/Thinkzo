import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 rounded-3xl ${
      isScrolled 
        ? 'bg-navy-950/60 backdrop-blur-md shadow-2xl border-2 border-cyan-400/40 shadow-cyan-500/20' 
        : 'bg-navy-950/20 backdrop-blur-sm border-2 border-cyan-400/20 shadow-lg shadow-cyan-500/10'
    }`} style={{
      boxShadow: isScrolled 
        ? '0 0 30px rgba(34, 211, 238, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
        : '0 0 20px rgba(34, 211, 238, 0.1), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent opacity-90 hover:opacity-100 transition-opacity duration-300">
              Thinkzo.ai
            </h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-cyan-400 px-6 py-3 text-base font-medium transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transform hover:scale-105"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-300 hover:text-cyan-400 px-6 py-3 text-base font-medium transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transform hover:scale-105"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-cyan-400 px-6 py-3 text-base font-medium transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transform hover:scale-105"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-cyan-400 p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-navy-950/95 backdrop-blur-md rounded-2xl mt-2">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-cyan-400 block px-6 py-3 text-lg font-medium w-full text-left transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-300 hover:text-cyan-400 block px-6 py-3 text-lg font-medium w-full text-left transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-cyan-400 block px-6 py-3 text-lg font-medium w-full text-left transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;