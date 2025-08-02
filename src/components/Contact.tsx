import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Users } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { insertContact } from '../lib/supabase';
import { validateContactForm, contactFormRateLimit } from '../lib/validation';
import { useAccessibility } from '../hooks/useAccessibility';
import toast from 'react-hot-toast';

const Contact = () => {
  const { getContentSection } = useContent();
  const { announceToScreenReader, useUniqueId } = useAccessibility();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    phone: '',
    subject: '',
    service: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Generate unique IDs for form fields
  const nameId = useUniqueId('contact-name');
  const emailId = useUniqueId('contact-email');
  const phoneId = useUniqueId('contact-phone');
  const companyId = useUniqueId('contact-company');
  const websiteId = useUniqueId('contact-website');
  const serviceId = useUniqueId('contact-service');
  const budgetId = useUniqueId('contact-budget');
  const timelineId = useUniqueId('contact-timeline');
  const subjectId = useUniqueId('contact-subject');
  const messageId = useUniqueId('contact-message');
  
  // Get contact info from CMS
  const contactInfo = getContentSection('contact_info')?.content || {
    email: 'team@thinkzo.ai',
    phone: '(844) 844-6596',
    address: '123 Design Street, Creative City, CC 12345',
    hours: 'Monday - Friday: 9AM - 6PM PST'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Rate limiting check
    const userKey = `${formData.email || 'anonymous'}-${Date.now()}`;
    if (!contactFormRateLimit.isAllowed(userKey)) {
      const remainingTime = Math.ceil(contactFormRateLimit.getRemainingTime(userKey) / 1000);
      toast.error(`Please wait ${remainingTime} seconds before submitting again`);
      return;
    }
    
    // Validate and sanitize input
    const validation = validateContactForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      website: formData.website,
      message: formData.message,
      subject: formData.subject
    });
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      announceToScreenReader('Please correct the form errors and try again');
      toast.error('Please correct the form errors and try again');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Use sanitized data
      const contactData = {
        name: validation.sanitized.name,
        email: validation.sanitized.email,
        phone: validation.sanitized.phone || undefined,
        company: validation.sanitized.company || undefined,
        subject: validation.sanitized.subject || `${formData.service} Inquiry`,
        message: `Service: ${formData.service}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\nWebsite: ${validation.sanitized.website || ''}\n\n${validation.sanitized.message}`,
        contact_type: 'sales' as const,
        priority: 'high' as const,
        source: 'contact_form',
        metadata: {
          service_type: formData.service,
          budget_range: formData.budget,
          timeline: formData.timeline,
          company_website: formData.website,
          project_goals: formData.message
        }
      };

      const { data, error } = await insertContact(contactData);

      if (error) throw error;

      announceToScreenReader('Message sent successfully! We will get back to you soon.');
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        website: '',
        phone: '',
        subject: '',
        service: '',
        budget: '',
        timeline: '',
        message: ''
      });
    } catch (error: any) {
      announceToScreenReader('Failed to send message. Please try again.');
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-gradient-to-br from-slate-800 to-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Work Together
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Ready to transform your digital presence? Get in touch and let's discuss your project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={nameId} className="block text-slate-400 text-sm mb-2">
                    Full Name *
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-describedby={validationErrors.name ? `${nameId}-error` : undefined}
                    aria-invalid={!!validationErrors.name}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                  {validationErrors.name && (
                    <div id={`${nameId}-error`} className="text-red-400 text-sm mt-1" role="alert">
                      {validationErrors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor={emailId} className="block text-slate-400 text-sm mb-2">
                    Email Address *
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-describedby={validationErrors.email ? `${emailId}-error` : undefined}
                    aria-invalid={!!validationErrors.email}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                  {validationErrors.email && (
                    <div id={`${emailId}-error`} className="text-red-400 text-sm mt-1" role="alert">
                      {validationErrors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={companyId} className="block text-slate-400 text-sm mb-2">
                    Company
                  </label>
                  <input
                    id={companyId}
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    aria-describedby={validationErrors.company ? `${companyId}-error` : undefined}
                    aria-invalid={!!validationErrors.company}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Your Company"
                  />
                  {validationErrors.company && (
                    <div id={`${companyId}-error`} className="text-red-400 text-sm mt-1" role="alert">
                      {validationErrors.company}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor={websiteId} className="block text-slate-400 text-sm mb-2">
                    Company Website
                  </label>
                  <input
                    id={websiteId}
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    aria-describedby={validationErrors.website ? `${websiteId}-error` : undefined}
                    aria-invalid={!!validationErrors.website}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="https://yourcompany.com"
                  />
                  {validationErrors.website && (
                    <div id={`${websiteId}-error`} className="text-red-400 text-sm mt-1" role="alert">
                      {validationErrors.website}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor={phoneId} className="block text-slate-400 text-sm mb-2">
                    Phone Number
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-describedby={validationErrors.phone ? `${phoneId}-error` : undefined}
                    aria-invalid={!!validationErrors.phone}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                  {validationErrors.phone && (
                    <div id={`${phoneId}-error`} className="text-red-400 text-sm mt-1" role="alert">
                      {validationErrors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={serviceId} className="block text-slate-400 text-sm mb-2">
                    Service Needed
                  </label>
                  <select
                    id={serviceId}
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    aria-label="Select the service you need"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="website-design">Website Design</option>
                    <option value="web-development">Web Development</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="brand-identity">Brand Identity</option>
                    <option value="seo">SEO Optimization</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={budgetId} className="block text-slate-400 text-sm mb-2">
                    Budget Range
                  </label>
                  <select
                    id={budgetId}
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    aria-label="Select your budget range"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="over-50k">Over $50,000</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={timelineId} className="block text-slate-400 text-sm mb-2">
                  Project Timeline
                </label>
                <select
                  id={timelineId}
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  aria-label="Select your project timeline"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label htmlFor={subjectId} className="block text-slate-400 text-sm mb-2">
                  Subject
                </label>
                <input
                  id={subjectId}
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  aria-describedby={validationErrors.subject ? `${subjectId}-error` : undefined}
                  aria-invalid={!!validationErrors.subject}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Project inquiry"
                />
                {validationErrors.subject && (
                  <div id={`${subjectId}-error`} className="text-red-400 text-sm mt-1" role="alert">
                    {validationErrors.subject}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor={messageId} className="block text-slate-400 text-sm mb-2">
                  Project Goals & Details *
                </label>
                <textarea
                  id={messageId}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  aria-describedby={validationErrors.message ? `${messageId}-error` : undefined}
                  aria-invalid={!!validationErrors.message}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  placeholder="Describe your project goals, specific requirements, and what success looks like for your business..."
                />
                {validationErrors.message && (
                  <div id={`${messageId}-error`} className="text-red-400 text-sm mt-1" role="alert">
                    {validationErrors.message}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                aria-label={isSubmitting ? 'Sending your message, please wait' : 'Send your message to Thinkzo'}
                className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Get in touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Mail className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-slate-400">{contactInfo.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Phone className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Phone</div>
                    <div className="text-slate-400">
                      {contactInfo.phone}
                      <div className="text-xs text-slate-500 mt-1">US services only</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Why choose us?
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="text-purple-400" size={20} />
                  <span className="text-slate-300">Fast turnaround times</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="text-purple-400" size={20} />
                  <span className="text-slate-300">Dedicated project manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Send className="text-purple-400" size={20} />
                  <span className="text-slate-300">24/7 support available</span>
                </div>
                <div className="pt-2 border-t border-slate-700/50">
                  <div className="text-slate-500 text-sm">
                    * Currently serving US-based clients only
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;