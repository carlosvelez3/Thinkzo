import React, { useState, useRef } from 'react';
import { Mail, CheckCircle, User, DollarSign, FileText, Clock, Building, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import TypewriterText from './TypewriterText';

// Form validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

const validateLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

// Form data interface with validation
interface FormData {
  name: string;
  email: string;
  company: string;
  serviceType: string;
  budgetRange: string;
  projectDescription: string;
  timeFrame: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectDescription?: string;
  general?: string;
}

const Contact: React.FC = () => {
  // Form state management
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    serviceType: '',
    budgetRange: '',
    projectDescription: '',
    timeFrame: ''
  });

  // UI state management
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitAttempts, setSubmitAttempts] = useState(0);
  
  // Refs for accessibility and focus management
  const formRef = useRef<HTMLFormElement>(null);
  const firstErrorRef = useRef<HTMLInputElement>(null);

  // Rate limiting: prevent spam submissions
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const RATE_LIMIT_MS = 30000; // 30 seconds between submissions

  /**
   * Comprehensive form validation
   * Priority: CRITICAL - Prevents invalid data submission
   */
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    } else if (!validateLength(formData.name, 2, 100)) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }

    // Email validation
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!validateLength(formData.email, 5, 254)) {
      newErrors.email = 'Email must be between 5 and 254 characters';
    }

    // Project description validation
    if (!validateRequired(formData.projectDescription)) {
      newErrors.projectDescription = 'Project description is required';
    } else if (!validateLength(formData.projectDescription, 10, 2000)) {
      newErrors.projectDescription = 'Project description must be between 10 and 2000 characters';
    }

    return newErrors;
  };

  /**
   * Enhanced input change handler with real-time validation
   * Priority: HIGH - Improves user experience
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear general error
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: undefined
      }));
    }

    console.log('✏️ Form field changed:', { 
      field: name, 
      value: value.substring(0, 50) + (value.length > 50 ? '...' : ''),
      timestamp: new Date().toISOString()
    });
  };

  /**
   * Sanitize form data before submission
   * Priority: HIGH - Security measure
   */
  const sanitizeFormData = (data: FormData): FormData => {
    return {
      name: data.name.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 254),
      company: data.company.trim().substring(0, 100),
      serviceType: data.serviceType.trim(),
      budgetRange: data.budgetRange.trim(),
      projectDescription: data.projectDescription.trim().substring(0, 2000),
      timeFrame: data.timeFrame.trim()
    };
  };

  /**
   * Enhanced form submission handler with comprehensive error handling
   * Priority: CRITICAL - Core functionality
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started:', { 
      timestamp: new Date().toISOString(),
      attempt: submitAttempts + 1
    });

    // Increment submission attempts for tracking
    setSubmitAttempts(prev => prev + 1);

    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmissionTime < RATE_LIMIT_MS) {
      const remainingTime = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionTime)) / 1000);
      setErrors({ general: `Please wait ${remainingTime} seconds before submitting again.` });
      return;
    }

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Focus on first error field for accessibility
      setTimeout(() => {
        if (firstErrorRef.current) {
          firstErrorRef.current.focus();
        }
      }, 100);
      
      console.error('❌ Form validation failed:', validationErrors);
      return;
    }

    // Clear errors and set loading state
    setErrors({});
    setIsLoading(true);
    
    // Environment validation with detailed logging
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('🔍 Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING'
    });

    if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
      console.error('❌ Supabase configuration missing');
      setErrors({ 
        general: 'Configuration error. Please contact support at team@thinkzo.ai' 
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sanitize form data
      const sanitizedData = sanitizeFormData(formData);
      console.log('🧹 Form data sanitized successfully');

      // Submit to backend Edge Function (handles both DB and email)
      console.log('📡 Submitting to submit-contact Edge Function...');
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedData.name,
          email: sanitizedData.email,
          company: sanitizedData.company || null,
          serviceType: sanitizedData.serviceType || null,
          budgetRange: sanitizedData.budgetRange || null,
          projectDescription: sanitizedData.projectDescription,
          timeFrame: sanitizedData.timeFrame || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Backend error:', result);
        throw new Error(result.error || 'Failed to submit contact form');
      }

      console.log('✅ Form submitted successfully:', result);

      // Success state
      setIsSubmitted(true);
      setLastSubmissionTime(now);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        serviceType: '',
        budgetRange: '',
        projectDescription: '',
        timeFrame: ''
      });
      
      console.log('🔄 Form reset completed successfully');
      
      // Reset success message after 8 seconds
      setTimeout(() => {
        console.log('🔄 Resetting success message');
        setIsSubmitted(false);
      }, 8000);
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      
      // User-friendly error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setErrors({ 
          general: 'Network error. Please check your connection and try again.' 
        });
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
        setErrors({ 
          general: 'Too many requests. Please wait a moment before trying again.' 
        });
      } else {
        setErrors({ 
          general: 'Unable to submit form. Please try again or email us directly at team@thinkzo.ai' 
        });
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Form submission process completed');
    }
  };

  /**
   * Accessibility: Handle keyboard navigation
   * Priority: MEDIUM - Accessibility compliance
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as any);
    }
  };

  return (
    <section id="contact" className="py-20 bg-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-poppins text-white mb-6 tracking-tight">
            Start Your{' '}
            <span className="gradient-text">
              AI Project
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            <TypewriterText 
              text="Tell us about your project and we'll create a custom AI website solution tailored to your needs."
              speed={40}
              delay={2000}
            />
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 animate-fade-in backdrop-blur-sm">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Thank you!</h3>
              <p className="text-gray-300 font-light">
                We've received your project details and will get back to you within 24 hours with a custom proposal.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                You should also receive a confirmation email shortly.
              </p>
            </div>
          ) : (
            <form 
              ref={formRef}
              onSubmit={handleSubmit} 
              onKeyDown={handleKeyDown}
              className="space-y-6"
              noValidate
              aria-label="Contact form for project inquiries"
            >
              {/* General Error Message */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-fade-in backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div className="relative">
                <label htmlFor="name" className="sr-only">Full Name</label>
                <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  ref={errors.name ? firstErrorRef : undefined}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name *"
                  maxLength={100}
                  className={`w-full pl-12 pr-4 py-4 bg-navy-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-navy-700 focus:border-cyan-400 focus:ring-cyan-400/20'
                  }`}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  ref={errors.email && !errors.name ? firstErrorRef : undefined}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address *"
                  maxLength={254}
                  className={`w-full pl-12 pr-4 py-4 bg-navy-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-navy-700 focus:border-cyan-400 focus:ring-cyan-400/20'
                  }`}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Company Field */}
              <div className="relative">
                <label htmlFor="company" className="sr-only">Company Name</label>
                <Building size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name (optional)"
                  maxLength={100}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                  aria-describedby="company-help"
                />
                <p id="company-help" className="sr-only">Optional field for your company or organization name</p>
              </div>

              {/* Service Type Field */}
              <div className="relative">
                <label htmlFor="serviceType" className="sr-only">Service Type</label>
                <Briefcase size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                  aria-describedby="service-help"
                >
                  <option value="" className="bg-navy-800 text-gray-400">Select service type</option>
                  <option value="website-design" className="bg-navy-800 text-white">Website Design</option>
                  <option value="ai-integration" className="bg-navy-800 text-white">AI Integration</option>
                  <option value="automation" className="bg-navy-800 text-white">Business Automation</option>
                  <option value="consulting" className="bg-navy-800 text-white">AI Consulting</option>
                  <option value="custom-development" className="bg-navy-800 text-white">Custom Development</option>
                  <option value="other" className="bg-navy-800 text-white">Other</option>
                </select>
                <p id="service-help" className="sr-only">Select the type of service you're interested in</p>
              </div>

              {/* Budget Field */}
              <div className="relative">
                <label htmlFor="budgetRange" className="sr-only">Budget Range</label>
                <DollarSign size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                  aria-describedby="budget-help"
                >
                  <option value="" className="bg-navy-800 text-gray-400">Select your budget range</option>
                  <option value="under-500" className="bg-navy-800 text-white">Under $500</option>
                  <option value="500-1000" className="bg-navy-800 text-white">$500 - $1,000</option>
                  <option value="1000-2500" className="bg-navy-800 text-white">$1,000 - $2,500</option>
                  <option value="2500-5000" className="bg-navy-800 text-white">$2,500 - $5,000</option>
                  <option value="5000-plus" className="bg-navy-800 text-white">$5,000+</option>
                  <option value="custom" className="bg-navy-800 text-white">Custom Quote</option>
                </select>
                <p id="budget-help" className="sr-only">Select your approximate budget range for this project</p>
              </div>

              {/* Time Frame Field */}
              <div className="relative">
                <label htmlFor="timeFrame" className="sr-only">Project Timeline</label>
                <Clock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <select
                  id="timeFrame"
                  name="timeFrame"
                  value={formData.timeFrame}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                  aria-describedby="timeline-help"
                >
                  <option value="" className="bg-navy-800 text-gray-400">Select your timeline</option>
                  <option value="asap" className="bg-navy-800 text-white">ASAP (Rush)</option>
                  <option value="1-2-weeks" className="bg-navy-800 text-white">1-2 weeks</option>
                  <option value="2-4-weeks" className="bg-navy-800 text-white">2-4 weeks</option>
                  <option value="1-2-months" className="bg-navy-800 text-white">1-2 months</option>
                  <option value="flexible" className="bg-navy-800 text-white">Flexible timeline</option>
                </select>
                <p id="timeline-help" className="sr-only">Select your preferred project timeline</p>
              </div>

              {/* Project Description Field */}
              <div className="relative">
                <label htmlFor="projectDescription" className="sr-only">Project Description</label>
                <FileText size={20} className="absolute left-4 top-4 text-gray-400" aria-hidden="true" />
                <textarea
                  ref={errors.projectDescription && !errors.name && !errors.email ? firstErrorRef : undefined}
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your project, goals, and any specific requirements... *"
                  rows={5}
                  maxLength={2000}
                  className={`w-full pl-12 pr-4 py-4 bg-navy-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm resize-none ${
                    errors.projectDescription 
                      ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-navy-700 focus:border-cyan-400 focus:ring-cyan-400/20'
                  }`}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.projectDescription}
                  aria-describedby={errors.projectDescription ? "description-error" : "description-help"}
                />
                {errors.projectDescription && (
                  <p id="description-error" className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.projectDescription}
                  </p>
                )}
                <p id="description-help" className="mt-2 text-xs text-gray-400">
                  {formData.projectDescription.length}/2000 characters
                </p>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-describedby="submit-help"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending Project Details...
                  </>
                ) : (
                  'Get Custom Quote'
                )}
              </button>
              <p id="submit-help" className="text-xs text-gray-400 text-center mt-2">
                * Required fields. Press Ctrl+Enter to submit quickly.
              </p>
            </form>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-navy-700 text-center">
          <p className="text-gray-400 font-light">
            Questions? Reach out to us at{' '}
            <a 
              href="mailto:team@thinkzo.ai" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 rounded"
            >
              team@thinkzo.ai
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;