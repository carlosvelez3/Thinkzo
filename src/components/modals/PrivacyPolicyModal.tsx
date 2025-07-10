import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                  <Shield className="text-blue-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white">Privacy Policy</h2>
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
                  <Eye className="text-blue-400" size={20} />
                  <span>Introduction</span>
                </h3>
                <p className="leading-relaxed">
                  At Thinkzo ("we," "our," or "us"), we are committed to protecting your privacy and personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
                  our website or use our AI-powered digital services.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Database className="text-purple-400" size={20} />
                  <span>Information We Collect</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Name, email address, phone number</li>
                      <li>Company name and website</li>
                      <li>Project requirements and business goals</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Technical Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>IP address and browser information</li>
                      <li>Device type and operating system</li>
                      <li>Website usage patterns and analytics</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Users className="text-green-400" size={20} />
                  <span>How We Use Your Information</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Provide and improve our AI-powered services</li>
                  <li>Communicate with you about projects and services</li>
                  <li>Process payments and manage accounts</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Analyze website usage and optimize user experience</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Lock className="text-yellow-400" size={20} />
                  <span>Information Sharing and Disclosure</span>
                </h3>
                <p className="leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist in our operations</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Shield className="text-red-400" size={20} />
                  <span>Data Security</span>
                </h3>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, 
                  and regular security assessments.
                </p>
              </section>

              {/* Your Rights */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Your Rights and Choices</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Disable cookies through your browser settings</li>
                  <li>Request data portability</li>
                </ul>
              </section>

              {/* Cookies */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Cookies and Tracking</h3>
                <p className="leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                  and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              {/* Third-Party Services */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Third-Party Services</h3>
                <p className="leading-relaxed">
                  Our website may contain links to third-party services or integrate with external platforms. 
                  We are not responsible for the privacy practices of these third parties.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Children's Privacy</h3>
                <p className="leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Mail className="text-pink-400" size={20} />
                  <span>Contact Us</span>
                </h3>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-slate-700/30 rounded-xl">
                  <p className="text-white font-medium">Thinkzo</p>
                  <p>Email: privacy@thinkzo.ai</p>
                  <p>Phone: (844) 844-6596</p>
                </div>
              </section>

              {/* Updates */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Policy Updates</h3>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes 
                  by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;