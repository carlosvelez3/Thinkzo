import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Settings, BarChart3, Target, Shield } from 'lucide-react';

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-slate-700/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 z-10"
            >
              <X size={24} />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center">
                  <Cookie className="text-orange-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white">Cookie Policy</h2>
              </div>
              <p className="text-slate-400">
                Last updated: January 10, 2025
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-slate-300">
              {/* Introduction */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Cookie className="text-orange-400" size={20} />
                  <span>What Are Cookies?</span>
                </h3>
                <p className="leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit our website. They help us 
                  provide you with a better browsing experience by remembering your preferences, analyzing site traffic, 
                  and personalizing content. This Cookie Policy explains how Thinkzo uses cookies and similar technologies.
                </p>
              </section>

              {/* Types of Cookies */}
              <section>
                <h3 className="text-xl font-bold text-white mb-6">Types of Cookies We Use</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Essential Cookies */}
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="text-red-400" size={20} />
                      </div>
                      <h4 className="font-semibold text-white">Essential Cookies</h4>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">
                      These cookies are necessary for the website to function properly and cannot be disabled.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Authentication and security</li>
                      <li>Form submission and validation</li>
                      <li>Shopping cart functionality</li>
                      <li>Load balancing</li>
                    </ul>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="text-blue-400" size={20} />
                      </div>
                      <h4 className="font-semibold text-white">Analytics Cookies</h4>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">
                      Help us understand how visitors interact with our website by collecting anonymous information.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Page views and traffic sources</li>
                      <li>User behavior patterns</li>
                      <li>Performance metrics</li>
                      <li>Error tracking</li>
                    </ul>
                  </div>

                  {/* Functional Cookies */}
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Settings className="text-green-400" size={20} />
                      </div>
                      <h4 className="font-semibold text-white">Functional Cookies</h4>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">
                      Enable enhanced functionality and personalization based on your preferences.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Language preferences</li>
                      <li>Theme settings</li>
                      <li>Chat widget preferences</li>
                      <li>Form auto-fill</li>
                    </ul>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Target className="text-purple-400" size={20} />
                      </div>
                      <h4 className="font-semibold text-white">Marketing Cookies</h4>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">
                      Used to track visitors across websites to display relevant advertisements.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Ad personalization</li>
                      <li>Conversion tracking</li>
                      <li>Retargeting campaigns</li>
                      <li>Social media integration</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Third-Party Cookies */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Third-Party Cookies</h3>
                <p className="leading-relaxed mb-4">
                  We may use third-party services that set their own cookies. These include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/20 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Google Analytics</h4>
                    <p className="text-sm">Website traffic analysis and user behavior insights</p>
                  </div>
                  <div className="bg-slate-700/20 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Supabase</h4>
                    <p className="text-sm">Authentication and database services</p>
                  </div>
                  <div className="bg-slate-700/20 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">OpenAI</h4>
                    <p className="text-sm">AI chat functionality and neural processing</p>
                  </div>
                  <div className="bg-slate-700/20 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Netlify</h4>
                    <p className="text-sm">Website hosting and performance optimization</p>
                  </div>
                </div>
              </section>

              {/* Cookie Duration */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Cookie Duration</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Session Cookies</h4>
                    <p className="text-sm leading-relaxed">
                      Temporary cookies that are deleted when you close your browser. Used for essential website functionality.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Persistent Cookies</h4>
                    <p className="text-sm leading-relaxed">
                      Remain on your device for a set period (typically 30 days to 2 years) or until you delete them. 
                      Used for preferences and analytics.
                    </p>
                  </div>
                </div>
              </section>

              {/* Managing Cookies */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Managing Your Cookie Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Browser Settings</h4>
                    <p className="text-sm leading-relaxed mb-2">
                      You can control cookies through your browser settings:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Block all cookies</li>
                      <li>Block third-party cookies only</li>
                      <li>Delete existing cookies</li>
                      <li>Set notifications when cookies are sent</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Opt-Out Links</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-400 hover:text-blue-300">Google Analytics Opt-out</a></li>
                      <li><a href="https://www.aboutads.info/choices/" className="text-blue-400 hover:text-blue-300">Digital Advertising Alliance</a></li>
                      <li><a href="https://www.networkadvertising.org/choices/" className="text-blue-400 hover:text-blue-300">Network Advertising Initiative</a></li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Impact of Disabling */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Impact of Disabling Cookies</h3>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-yellow-400">Please note:</strong> Disabling certain cookies may affect 
                    website functionality. Essential cookies cannot be disabled as they are necessary for basic 
                    website operations like security and authentication.
                  </p>
                </div>
              </section>

              {/* Updates to Policy */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Updates to This Policy</h3>
                <p className="leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for 
                  other operational, legal, or regulatory reasons. We will notify you of any material changes by 
                  posting the new policy on this page.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                <p className="leading-relaxed mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <p className="text-white font-medium">Thinkzo</p>
                  <p>Email: privacy@thinkzo.ai</p>
                  <p>Phone: (844) 844-6596</p>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookiePolicyModal;