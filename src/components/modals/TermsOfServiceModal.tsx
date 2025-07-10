import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Scale, AlertTriangle, DollarSign, Shield, Users } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
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
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
                  <FileText className="text-green-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white">Terms of Service</h2>
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
                  <Scale className="text-blue-400" size={20} />
                  <span>Agreement to Terms</span>
                </h3>
                <p className="leading-relaxed">
                  By accessing and using Thinkzo's website and services, you accept and agree to be bound by the terms 
                  and provision of this agreement. These Terms of Service ("Terms") govern your use of our AI-powered 
                  digital services, website design, and related offerings.
                </p>
              </section>

              {/* Services Description */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Users className="text-purple-400" size={20} />
                  <span>Our Services</span>
                </h3>
                <p className="leading-relaxed mb-4">
                  Thinkzo provides AI-powered digital solutions including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Neural Website Design and Development</li>
                  <li>Intelligent Branding and Identity Systems</li>
                  <li>Smart Mobile Application Development</li>
                  <li>Neural Marketing and Campaign Management</li>
                  <li>Performance AI and Optimization Services</li>
                  <li>AI Consulting and Strategy Development</li>
                </ul>
              </section>

              {/* User Responsibilities */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">User Responsibilities</h3>
                <p className="leading-relaxed mb-4">By using our services, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use our services only for lawful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not interfere with or disrupt our services</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              {/* Payment Terms */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <DollarSign className="text-green-400" size={20} />
                  <span>Payment and Billing</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Payment Terms</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Payment is due according to the agreed project timeline</li>
                      <li>We accept major credit cards and bank transfers</li>
                      <li>Late payments may incur additional fees</li>
                      <li>All prices are in USD and exclude applicable taxes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Refund Policy</h4>
                    <p className="text-sm leading-relaxed">
                      Refunds are considered on a case-by-case basis. Work completed and delivered 
                      according to agreed specifications is generally non-refundable.
                    </p>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Intellectual Property Rights</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Client Ownership</h4>
                    <p className="text-sm leading-relaxed">
                      Upon full payment, clients receive ownership of custom work created specifically for their project, 
                      excluding our proprietary tools, frameworks, and methodologies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Thinkzo Property</h4>
                    <p className="text-sm leading-relaxed">
                      We retain ownership of our AI algorithms, proprietary tools, templates, and general methodologies 
                      used in service delivery.
                    </p>
                  </div>
                </div>
              </section>

              {/* Service Limitations */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <AlertTriangle className="text-yellow-400" size={20} />
                  <span>Service Limitations and Disclaimers</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Services are provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee specific business outcomes or results</li>
                  <li>AI-generated content may require human review and refinement</li>
                  <li>Service availability may be subject to maintenance and updates</li>
                  <li>We are not liable for third-party service interruptions</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Limitation of Liability</h3>
                <p className="leading-relaxed">
                  To the maximum extent permitted by law, Thinkzo shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including without limitation, loss of profits, data, 
                  use, goodwill, or other intangible losses resulting from your use of our services.
                </p>
              </section>

              {/* Privacy and Data */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Shield className="text-blue-400" size={20} />
                  <span>Privacy and Data Protection</span>
                </h3>
                <p className="leading-relaxed">
                  Your privacy is important to us. Our collection and use of personal information is governed by our 
                  Privacy Policy, which is incorporated into these Terms by reference.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Termination</h3>
                <p className="leading-relaxed">
                  Either party may terminate services with written notice. Upon termination, you remain responsible 
                  for all charges incurred up to the termination date. We may suspend or terminate access for 
                  violation of these Terms.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Governing Law</h3>
                <p className="leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the United States, 
                  without regard to its conflict of law provisions.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Changes to Terms</h3>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                  by posting the new Terms on this page and updating the "Last updated" date.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                <p className="leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <p className="text-white font-medium">Thinkzo</p>
                  <p>Email: legal@thinkzo.ai</p>
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

export default TermsOfServiceModal;