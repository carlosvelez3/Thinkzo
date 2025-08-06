import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Mail, Download } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    setSessionId(sessionIdParam);
  }, []);

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-8 border border-navy-700">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle size={64} className="text-green-400 mx-auto animate-pulse" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins text-white mb-4 tracking-tight">
            Payment <span className="gradient-text">Successful!</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
            Thank you for choosing Thinkzo.ai! Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          <div className="bg-navy-900/50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Mail size={20} />
              What happens next?
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <span>You'll receive a confirmation email with your order details</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <span>Our team will contact you within 24 hours to start your project</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <span>We'll gather your requirements and begin designing your AI website</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <span>Your website will be delivered according to your chosen timeline</span>
              </li>
            </ul>
          </div>

          {/* Session ID for reference */}
          {sessionId && (
            <div className="bg-navy-900/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400">
                Order Reference: <span className="text-cyan-400 font-mono">{sessionId}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goHome}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Return to Homepage
            </button>
            
            <a
              href="mailto:team@thinkzo.ai"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Mail size={20} />
              Contact Support
            </a>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-navy-700">
            <p className="text-gray-400 text-sm">
              Questions about your order? Contact us at{' '}
              <a href="mailto:team@thinkzo.ai" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                team@thinkzo.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;