import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Palette } from 'lucide-react';
import StartProjectModal from './StartProjectModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6"
      >
        <motion.div
          animate={{
            backgroundColor: scrolled 
              ? "rgba(15, 23, 42, 0.1)" 
              : "rgba(15, 23, 42, 0.05)",
            backdropFilter: "blur(20px)",
            borderColor: scrolled 
              ? "rgba(148, 163, 184, 0.15)" 
              : "rgba(148, 163, 184, 0.1)"
          }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/5 backdrop-blur-xl border border-slate-400/10 rounded-2xl shadow-2xl w-full max-w-4xl"
        >
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Palette className="text-white" size={16} />
              </div>
              <span className="text-white font-bold text-lg">Thinkzo</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Services', 'Process', 'Pricing', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ y: -2 }}
                  className="text-white/90 hover:text-white transition-all duration-300 relative group"
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"
                  />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Start Project
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/10">
              <div className="flex flex-col space-y-4">
                {['Services', 'Process', 'Pricing', 'Contact'].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: isOpen ? 1 : 0, 
                      x: isOpen ? 0 : -20 
                    }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white/90 hover:text-white transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isOpen ? 1 : 0, 
                    y: isOpen ? 0 : 20 
                  }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium w-fit mt-2"
                >
                  Start Project
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Start Project Modal */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;