import React, { useState } from 'react';
import { Mail, CheckCircle, User, DollarSign, FileText, Clock, Building, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TypewriterText from './TypewriterText';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serviceType: '',
    budgetRange: '',
    projectDescription: '',
    timeFrame: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('✏️ Form field changed:', { 
      field: name, 
      value: value,
      previousValue: formData[name as keyof typeof formData],
      timestamp: new Date().toISOString(),
      formState: { ...formData, [name]: value }
    });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started:', { 
      formData, 
      timestamp: new Date().toISOString(),
      requiredFieldsCheck: {
        name: !!formData.name,
        email: !!formData.email,
        projectDescription: !!formData.projectDescription
      }
    });
    
    if (!formData.name || !formData.email || !formData.projectDescription) {
      console.error('❌ Form validation failed - missing required fields:', {
        name: !formData.name ? 'MISSING' : 'OK',
        email: !formData.email ? 'MISSING' : 'OK', 
        projectDescription: !formData.projectDescription ? 'MISSING' : 'OK'
      });
      return;
    }
    
    setIsLoading(true);
    console.log('✅ Form validation passed, setting loading state');
    
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || 
        !import.meta.env.VITE_SUPABASE_ANON_KEY ||
        import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' ||
        import.meta.env.VITE_SUPABASE_ANON_KEY === 'your-anon-key') {
      console.warn('⚠️ Supabase not properly configured. Please check your environment variables.');
      console.warn('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      alert('Configuration Error: Please contact support. The form cannot be submitted at this time.');
      setIsLoading(false);
      return;
    }

    // Fallback for development/demo purposes
    if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
      console.warn('⚠️ Using demo Supabase configuration, showing success message without actual processing');
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        serviceType: '',
        budgetRange: '',
        projectDescription: '',
        timeFrame: ''
      });
      setIsLoading(false);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      return;
    }

    try {
      // Store in database
      console.log('💾 Storing contact message in database...');
      const { data: contactData, error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          service_type: formData.serviceType || null,
          budget_range: formData.budgetRange || null,
          message: formData.projectDescription,
          metadata: {
            timeFrame: formData.timeFrame || null,
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            source: 'website_contact_form'
          }
        }])
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database error:', dbError);
        throw new Error('Failed to save contact message');
      }

      console.log('✅ Contact message saved to database:', contactData);

      // Send email notification
      console.log('📧 Sending email notification to team@thinkzo.ai...');
      const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const emailResult = await emailResponse.json();
      
      if (!emailResponse.ok) {
        console.error('❌ Email sending failed:', emailResult);
        console.warn('⚠️ Email failed but form was saved to database');
        // Don't throw error - form submission should still succeed even if email fails
      }

      if (emailResponse.ok) {
        console.log('✅ Email notification sent successfully to team@thinkzo.ai:', emailResult);
      }
      
      setIsSubmitted(true);
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
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        console.log('🔄 Resetting success message');
        setIsSubmitted(false);
      }, 5000);
      
    } catch (_error) {
      console.error('❌ Form submission error:', _error);
      alert('There was an error submitting your form. Please try again or email us directly at team@thinkzo.ai');
    } finally {
      setIsLoading(false);
      console.log('🏁 Form submission process completed, loading state cleared');
    }
  };

  return (
    <section id="contact" className="py-20 bg-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-poppins text-white mb-6 tracking-tight">
            <TypewriterText 
              text="Start Your " 
              speed={100}
              className="inline"
            />
            <span className="gradient-text">
              <TypewriterText 
                text="AI Project" 
                speed={100}
                delay={1000}
                className="inline"
              />
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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Company Field */}
              <div className="relative">
                <Building size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name (optional)"
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              {/* Service Type Field */}
              <div className="relative">
                <Briefcase size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-navy-800 text-gray-400">Select service type</option>
                  <option value="website-design" className="bg-navy-800 text-white">Website Design</option>
                  <option value="ai-integration" className="bg-navy-800 text-white">AI Integration</option>
                  <option value="automation" className="bg-navy-800 text-white">Business Automation</option>
                  <option value="consulting" className="bg-navy-800 text-white">AI Consulting</option>
                  <option value="custom-development" className="bg-navy-800 text-white">Custom Development</option>
                  <option value="other" className="bg-navy-800 text-white">Other</option>
                </select>
              </div>

              {/* Budget Field */}
              <div className="relative">
                <DollarSign size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-navy-800 text-gray-400">Select your budget range</option>
                  <option value="under-500" className="bg-navy-800 text-white">Under $500</option>
                  <option value="500-1000" className="bg-navy-800 text-white">$500 - $1,000</option>
                  <option value="1000-2500" className="bg-navy-800 text-white">$1,000 - $2,500</option>
                  <option value="2500-5000" className="bg-navy-800 text-white">$2,500 - $5,000</option>
                  <option value="5000-plus" className="bg-navy-800 text-white">$5,000+</option>
                  <option value="custom" className="bg-navy-800 text-white">Custom Quote</option>
                </select>
              </div>

              {/* Time Frame Field */}
              <div className="relative">
                <Clock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="timeFrame"
                  value={formData.timeFrame}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-navy-800 text-gray-400">Select your timeline</option>
                  <option value="asap" className="bg-navy-800 text-white">ASAP (Rush)</option>
                  <option value="1-2-weeks" className="bg-navy-800 text-white">1-2 weeks</option>
                  <option value="2-4-weeks" className="bg-navy-800 text-white">2-4 weeks</option>
                  <option value="1-2-months" className="bg-navy-800 text-white">1-2 months</option>
                  <option value="flexible" className="bg-navy-800 text-white">Flexible timeline</option>
                </select>
              </div>

              {/* Project Description Field */}
              <div className="relative">
                <FileText size={20} className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your project, goals, and any specific requirements..."
                  rows={5}
                  className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending Project Details...' : 'Get Custom Quote'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-navy-700 text-center">
          <p className="text-gray-400 font-light">
            Questions? Reach out to us at{' '}
            <a href="mailto:team@thinkzo.ai" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              team@thinkzo.ai
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;