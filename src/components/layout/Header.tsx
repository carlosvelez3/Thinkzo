/**
 * Header Component with Authentication
 * Responsive navigation with user authentication state
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';
import AuthModal from '../auth/AuthModal';
import Logo from '../ui/Logo';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { navigationItems } = useContent();

  // Use navigation from CMS or fallback to default
  const navigation = navigationItems.length > 0 
    ? navigationItems.map(item => ({ name: item.label, href: item.href }))
    : [
        { name: 'Home', href: 'home' },
        { name: 'About', href: 'about' },
        { name: 'Services', href: 'services' },
        { name: 'AI Chat', href: 'chat' },
        { name: 'Contact', href: 'contact' },
      ];

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6"
      >
        <div className="bg-slate-900/20 backdrop-blur-xl border border-slate-400/20 rounded-2xl shadow-2xl w-full max-w-6xl">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3"
            >
              <Logo variant="header" animated={true} />
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => onNavigate(item.href)}
                  whileHover={{ y: -2 }}
                  className={`transition-all duration-300 relative group ${
                    currentPage === item.href
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.name}
                  <motion.div
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 ${
                      currentPage === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 bg-slate-800/50 text-white px-4 py-2 rounded-xl hover:bg-slate-800/70 transition-all duration-300"
                  >
                    <User size={16} />
                    <span>{user.user_metadata?.full_name || user.email}</span>
                  </motion.button>

                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl py-2 shadow-xl"
                    >
                      <button
                        onClick={() => onNavigate('profile')}
                        className="w-full text-left px-4 py-2 text-white hover:bg-slate-700/50 transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700/50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleAuthClick('signin')}
                    className="text-white hover:text-purple-300 transition-colors"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleAuthClick('signup')}
                    className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-purple-500/20"
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
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
                {navigation.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: isOpen ? 1 : 0, 
                      x: isOpen ? 0 : -20 
                    }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      onNavigate(item.href);
                      setIsOpen(false);
                    }}
                    className={`text-left py-2 transition-colors ${
                      currentPage === item.href
                        ? 'text-white'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </motion.button>
                ))}

                {/* Mobile Auth */}
                <div className="pt-4 border-t border-white/10">
                  {user ? (
                    <div className="space-y-2">
                      <div className="text-white text-sm">
                        {user.user_metadata?.full_name || user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="text-red-400 text-sm flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleAuthClick('signin');
                          setIsOpen(false);
                        }}
                        className="block text-white hover:text-purple-300 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          handleAuthClick('signup');
                          setIsOpen(false);
                        }}
                        className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-4 py-2 rounded-xl font-medium border border-purple-500/20"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;