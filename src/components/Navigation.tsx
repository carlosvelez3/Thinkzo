import React, { useState, useEffect } from 'react';
import { Menu, X, Info } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAboutModalOpen(false);
      }
    };

    if (isAboutModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isAboutModalOpen]);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const openAboutModal = () => {
    setIsAboutModalOpen(true);
    setIsMenuOpen(false);
  };
  return (
    <>
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
                onClick={openAboutModal}
                className="text-gray-300 hover:text-cyan-400 px-6 py-3 text-base font-medium transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transform hover:scale-105"
              >
                About Us
              </button>
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
                onClick={openAboutModal}
                className="text-gray-300 hover:text-cyan-400 block px-6 py-3 text-lg font-medium w-full text-left transition-all duration-300 rounded-xl bg-white/5 hover:bg-cyan-400/10 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30"
              >
                About Us
              </button>
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

      {/* About Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsAboutModalOpen(false)}
        >
          <div className="relative bg-navy-900/95 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-400/20 shadow-2xl shadow-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold font-poppins text-white mb-6 tracking-tight">
                About <span className="gradient-text">Thinkzo.ai</span>
              </h2>
              
              <div className="text-lg text-gray-300 leading-relaxed font-light space-y-4">
                <p>
                  <strong className="text-white">ThinkZo.ai was built on a simple idea:</strong><br />
                  AI-powered websites should be smart, fast, and affordable.
                </p>
                <p>
                  We combine cutting-edge technology with budget-friendly solutions to help entrepreneurs, creators, and growing businesses thrive online—without paying enterprise prices.
                </p>
              </div>
              
              {/* Crypto Payment Section */}
              <div className="mt-8 pt-6 border-t border-navy-700/50">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  Accepted Cryptocurrencies
                </h3>
                <div className="flex justify-center items-center flex-wrap gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-500/10 rounded-full border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300" title="Bitcoin (BTC)">
                      ₿
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300" title="Cardano (ADA)">
                      ADA
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-full border border-blue-600/20 hover:bg-blue-600/20 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300" title="USD Coin (USDC)">
                      USDC
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300" title="Ethereum (ETH)">
                      ETH
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/10 rounded-full border border-yellow-500/20 hover:bg-yellow-500/20 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300" title="Binance Coin (BNB)">
                      BNB
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 text-center mt-4">
                  We accept major cryptocurrencies for secure and flexible payments
                </p>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsAboutModalOpen(false)}
                  className="btn-primary"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;