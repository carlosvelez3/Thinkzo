/**
 * Testing Panel Component
 * Quick testing interface for contact forms and AI chat
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, MessageCircle, Mail, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { insertContact } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TestingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestingPanel: React.FC<TestingPanelProps> = ({ isOpen, onClose }) => {
  const [activeTest, setActiveTest] = useState<'contact' | 'chat' | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState(false);

  const testContactForm = async () => {
    setTesting(true);
    setActiveTest('contact');
    
    try {
      // Test contact form submission
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Test Company',
        subject: 'Test Contact Form',
        message: 'This is a test message to verify the contact form is working properly.',
        contact_type: 'general' as const,
        priority: 'medium' as const,
        source: 'testing_panel'
      };

      const { data, error } = await insertContact(testData);

      if (error) throw error;

      setTestResults(prev => ({
        ...prev,
        contact: {
          success: true,
          message: 'Contact form is working correctly!',
          data: data
        }
      }));

      toast.success('Contact form test passed!');
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        contact: {
          success: false,
          message: error.message || 'Contact form test failed',
          error: error
        }
      }));

      toast.error('Contact form test failed');
    } finally {
      setTesting(false);
    }
  };

  const testAIChat = async () => {
    setTesting(true);
    setActiveTest('chat');
    
    try {
      // Test AI chat functionality
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test message. Can you tell me about Thinkzo?'
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.message && data.message.length > 0) {
        setTestResults(prev => ({
          ...prev,
          chat: {
            success: true,
            message: 'AI Chat is working correctly!',
            response: data.message
          }
        }));

        toast.success('AI Chat test passed!');
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        chat: {
          success: false,
          message: error.message || 'AI Chat test failed',
          error: error
        }
      }));

      toast.error('AI Chat test failed');
    } finally {
      setTesting(false);
    }
  };

  const testSupabaseConnection = async () => {
    setTesting(true);
    
    try {
      // Test basic Supabase connection
      const { data, error } = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      if (error) throw error;

      setTestResults(prev => ({
        ...prev,
        supabase: {
          success: true,
          message: 'Supabase connection is working!',
          status: 'Connected'
        }
      }));

      toast.success('Supabase connection test passed!');
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        supabase: {
          success: false,
          message: error.message || 'Supabase connection failed',
          error: error
        }
      }));

      toast.error('Supabase connection test failed');
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
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
          className="absolute top-6 right-6 w-12 h-12 bg-slate-700/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
        >
          <X size={24} />
        </motion.button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
              <TestTube className="text-green-400" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white">
              System Testing Panel
            </h2>
          </div>
          <p className="text-slate-400">
            Test core functionality to ensure everything is working properly
          </p>
        </div>

        {/* Environment Check */}
        <div className="mb-8 p-6 bg-slate-700/30 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${import.meta.env.VITE_SUPABASE_URL ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-slate-300">VITE_SUPABASE_URL</span>
              <span className="text-xs text-slate-500">
                {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-slate-300">VITE_SUPABASE_ANON_KEY</span>
              <span className="text-xs text-slate-500">
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testSupabaseConnection}
            disabled={testing}
            className="flex flex-col items-center space-y-3 p-6 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-colors disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TestTube className="text-blue-400" size={24} />
            </div>
            <span className="text-white font-medium">Test Supabase</span>
            <span className="text-slate-400 text-sm text-center">Check database connection</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testContactForm}
            disabled={testing}
            className="flex flex-col items-center space-y-3 p-6 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-colors disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Mail className="text-purple-400" size={24} />
            </div>
            <span className="text-white font-medium">Test Contact Form</span>
            <span className="text-slate-400 text-sm text-center">Submit test contact message</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testAIChat}
            disabled={testing}
            className="flex flex-col items-center space-y-3 p-6 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-colors disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-green-400" size={24} />
            </div>
            <span className="text-white font-medium">Test AI Chat</span>
            <span className="text-slate-400 text-sm text-center">Send test message to AI</span>
          </motion.button>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Test Results</h3>
            {Object.entries(testResults).map(([test, result]) => (
              <div
                key={test}
                className={`p-4 rounded-xl border ${
                  result.success 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {result.success ? (
                    <CheckCircle className="text-green-400" size={20} />
                  ) : (
                    <AlertTriangle className="text-red-400" size={20} />
                  )}
                  <span className={`font-medium ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                    {test.charAt(0).toUpperCase() + test.slice(1)} Test
                  </span>
                </div>
                <p className="text-slate-300 mb-2">{result.message}</p>
                {result.response && (
                  <div className="bg-slate-800/50 rounded-lg p-3 mt-2">
                    <p className="text-slate-400 text-sm">AI Response:</p>
                    <p className="text-slate-300 text-sm mt-1">{result.response.substring(0, 200)}...</p>
                  </div>
                )}
                {result.error && (
                  <div className="bg-slate-800/50 rounded-lg p-3 mt-2">
                    <p className="text-red-400 text-sm">Error Details:</p>
                    <p className="text-slate-300 text-sm mt-1">{result.error.message || 'Unknown error'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {testing && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">
              Testing {activeTest === 'contact' ? 'contact form' : activeTest === 'chat' ? 'AI chat' : 'connection'}...
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TestingPanel;