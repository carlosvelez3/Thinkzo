import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StartProjectModal: React.FC<StartProjectModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    project_type: '',
    goals: '',
    timeline: '',
    budget: '',
    additional_notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Project submission:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        project_type: '',
        goals: '',
        timeline: '',
        budget: '',
        additional_notes: ''
      });
      onClose();
    }, 3000);
  };

  const projectTypes = [
    { label: 'Website', value: 'website' },
    { label: 'Mobile App', value: 'mobile_app' },
    { label: 'Branding', value: 'branding' },
    { label: 'Marketing Campaign', value: 'marketing' },
    { label: 'Other', value: 'other' }
  ];

  const timelines = [
    { label: 'ASAP', value: 'asap' },
    { label: 'Within a month', value: 'month' },
    { label: '1–3 months', value: '1-3_months' },
    { label: 'Flexible', value: 'flexible' }
  ];

  const budgets = [
    { label: '< $1,000', value: '<1000' },
    { label: '$1,000–$5,000', value: '1000-5000' },
    { label: '$5,000–$10,000', value: '5000-10000' },
    { label: '$10,000+', value: '10000+' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </motion.button>

            {!isSubmitted ? (
              <>
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-8"
                >
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center">
                      <Sparkles className="text-purple-400" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Start Your{' '}
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Neural Project
                      </span>
                    </h2>
                  </div>
                  <p className="text-slate-400">
                    Tell us about your vision and let our AI craft the perfect solution
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-slate-300 text-sm font-medium mb-3">
                      What type of project are you starting?
                    </label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-slate-300 text-sm font-medium mb-3">
                      What is the main goal of this project?
                    </label>
                    <input
                      type="text"
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Generate leads, improve design, increase conversions..."
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors placeholder-slate-400"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-slate-300 text-sm font-medium mb-3">
                        When do you need this completed?
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select timeline</option>
                        {timelines.map((timeline) => (
                          <option key={timeline.value} value={timeline.value}>
                            {timeline.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-slate-300 text-sm font-medium mb-3">
                        What's your estimated budget?
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select budget range</option>
                        {budgets.map((budget) => (
                          <option key={budget.value} value={budget.value}>
                            {budget.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-slate-300 text-sm font-medium mb-3">
                      Any additional notes or requirements?
                    </label>
                    <textarea
                      name="additional_notes"
                      value={formData.additional_notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us anything else we should know..."
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none placeholder-slate-400"
                    />
                  </motion.div>

                  {/* Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 pt-6"
                  >
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="flex-1 border-2 border-slate-600/30 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-700/30 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-6 py-3 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 flex items-center justify-center space-x-2 border border-purple-500/20"
                    >
                      <span>Submit Project Info</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </motion.div>
                </form>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="text-emerald-400" size={40} />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white mb-4"
                >
                  Project Submitted!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 mb-6"
                >
                  Our neural network is analyzing your requirements. 
                  We'll contact you within 24 hours with a personalized proposal.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-slate-500"
                >
                  This window will close automatically...
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartProjectModal;