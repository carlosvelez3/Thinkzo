/**
 * Publish Readiness Check Component
 * Final checklist before going live
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Rocket, 
  Globe, 
  Shield, 
  Users, 
  MessageCircle,
  Settings,
  Eye,
  ExternalLink
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  critical: boolean;
  completed: boolean;
  action?: string;
}

const PublishReadinessCheck: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Content & Design
    {
      id: 'hero-content',
      category: 'Content & Design',
      title: 'Hero section content is finalized',
      description: 'Main headline, subtitle, and call-to-action buttons are set',
      critical: true,
      completed: false,
      action: 'Edit via Content Editor'
    },
    {
      id: 'about-content',
      category: 'Content & Design',
      title: 'About page content is complete',
      description: 'Company mission, values, and team information are added',
      critical: true,
      completed: false,
      action: 'Edit via Content Editor'
    },
    {
      id: 'contact-info',
      category: 'Content & Design',
      title: 'Contact information is accurate',
      description: 'Email, phone, address, and business hours are correct',
      critical: true,
      completed: false,
      action: 'Update in Site Settings'
    },
    {
      id: 'team-members',
      category: 'Content & Design',
      title: 'Team members are added',
      description: 'Team profiles with photos and bios are configured',
      critical: false,
      completed: false,
      action: 'Manage via Team Management'
    },
    {
      id: 'services-content',
      category: 'Content & Design',
      title: 'Services are properly described',
      description: 'All service offerings are clearly explained',
      critical: true,
      completed: false,
      action: 'Review Services page'
    },

    // Technical Setup
    {
      id: 'domain-setup',
      category: 'Technical Setup',
      title: 'Custom domain is configured',
      description: 'Your domain points to the hosting platform',
      critical: true,
      completed: false,
      action: 'Configure in hosting dashboard'
    },
    {
      id: 'ssl-certificate',
      category: 'Technical Setup',
      title: 'SSL certificate is active',
      description: 'HTTPS is enabled and working properly',
      critical: true,
      completed: false,
      action: 'Verify in hosting settings'
    },
    {
      id: 'env-production',
      category: 'Technical Setup',
      title: 'Production environment variables are set',
      description: 'All required environment variables are configured',
      critical: true,
      completed: false,
      action: 'Check hosting environment settings'
    },
    {
      id: 'database-production',
      category: 'Technical Setup',
      title: 'Production database is configured',
      description: 'Supabase production project is set up and migrated',
      critical: true,
      completed: false,
      action: 'Run migrations on production database'
    },

    // Functionality Testing
    {
      id: 'contact-form-test',
      category: 'Functionality Testing',
      title: 'Contact form is tested',
      description: 'Form submissions are working and being stored',
      critical: true,
      completed: false,
      action: 'Test via System Testing panel'
    },
    {
      id: 'ai-chat-test',
      category: 'Functionality Testing',
      title: 'AI chat is functional',
      description: 'ChatGPT integration is working properly',
      critical: false,
      completed: false,
      action: 'Test via AI Chat page'
    },
    {
      id: 'admin-access-test',
      category: 'Functionality Testing',
      title: 'Admin access is working',
      description: 'Admin login and dashboard functionality verified',
      critical: true,
      completed: false,
      action: 'Test admin login and features'
    },
    {
      id: 'mobile-responsive',
      category: 'Functionality Testing',
      title: 'Mobile responsiveness verified',
      description: 'Site works well on mobile devices and tablets',
      critical: true,
      completed: false,
      action: 'Test on various device sizes'
    },

    // SEO & Analytics
    {
      id: 'meta-tags',
      category: 'SEO & Analytics',
      title: 'Meta tags are optimized',
      description: 'Title tags, descriptions, and Open Graph tags are set',
      critical: true,
      completed: false,
      action: 'Review in Site Settings'
    },
    {
      id: 'sitemap',
      category: 'SEO & Analytics',
      title: 'Sitemap is configured',
      description: 'XML sitemap is available and submitted to search engines',
      critical: false,
      completed: false,
      action: 'Check /sitemap.xml'
    },
    {
      id: 'robots-txt',
      category: 'SEO & Analytics',
      title: 'Robots.txt is configured',
      description: 'Search engine crawling instructions are set',
      critical: false,
      completed: false,
      action: 'Check /robots.txt'
    },
    {
      id: 'analytics-setup',
      category: 'SEO & Analytics',
      title: 'Analytics tracking is set up',
      description: 'Google Analytics or similar tracking is configured',
      critical: false,
      completed: false,
      action: 'Add tracking code if needed'
    },

    // Security & Performance
    {
      id: 'security-headers',
      category: 'Security & Performance',
      title: 'Security headers are configured',
      description: 'Proper security headers are set by hosting platform',
      critical: true,
      completed: false,
      action: 'Verify in hosting security settings'
    },
    {
      id: 'performance-optimized',
      category: 'Security & Performance',
      title: 'Performance is optimized',
      description: 'Page load times are acceptable (< 3 seconds)',
      critical: true,
      completed: false,
      action: 'Test with PageSpeed Insights'
    },
    {
      id: 'backup-strategy',
      category: 'Security & Performance',
      title: 'Backup strategy is in place',
      description: 'Database and content backups are configured',
      critical: false,
      completed: false,
      action: 'Configure in Supabase dashboard'
    }
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const categories = Array.from(new Set(checklist.map(item => item.category)));
  
  const getCompletionStats = () => {
    const total = checklist.length;
    const completed = checklist.filter(item => item.completed).length;
    const critical = checklist.filter(item => item.critical).length;
    const criticalCompleted = checklist.filter(item => item.critical && item.completed).length;
    
    return { total, completed, critical, criticalCompleted };
  };

  const stats = getCompletionStats();
  const isReadyToPublish = stats.criticalCompleted === stats.critical;
  const completionPercentage = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Publication Readiness Checklist
        </h2>
        <p className="text-slate-400 mb-6">
          Complete this checklist to ensure your website is ready for launch
        </p>
        
        {/* Progress */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm">Progress</span>
            <span className="text-slate-300 text-sm">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border text-center ${
          isReadyToPublish
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-yellow-500/10 border-yellow-500/30'
        }`}
      >
        {isReadyToPublish ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Rocket className="text-green-400" size={32} />
              <h3 className="text-2xl font-bold text-green-400">Ready to Launch!</h3>
            </div>
            <p className="text-slate-300">
              All critical items are complete. Your website is ready for publication.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500/20 border border-green-500/30 text-green-400 px-8 py-3 rounded-xl font-medium hover:bg-green-500/30 transition-colors"
            >
              <Globe size={20} className="inline mr-2" />
              Deploy to Production
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Settings className="text-yellow-400" size={32} />
              <h3 className="text-2xl font-bold text-yellow-400">Almost Ready</h3>
            </div>
            <p className="text-slate-300">
              Complete {stats.critical - stats.criticalCompleted} more critical items before publishing.
            </p>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.completed}/{stats.total}</div>
          <div className="text-slate-400 text-sm">Total Items</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">{stats.criticalCompleted}/{stats.critical}</div>
          <div className="text-slate-400 text-sm">Critical Items</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{completionPercentage}%</div>
          <div className="text-slate-400 text-sm">Complete</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{categories.length}</div>
          <div className="text-slate-400 text-sm">Categories</div>
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
              {category === 'Content & Design' && <Eye className="text-purple-400" size={24} />}
              {category === 'Technical Setup' && <Settings className="text-blue-400" size={24} />}
              {category === 'Functionality Testing' && <CheckCircle className="text-green-400" size={24} />}
              {category === 'SEO & Analytics' && <Globe className="text-pink-400" size={24} />}
              {category === 'Security & Performance' && <Shield className="text-orange-400" size={24} />}
              <span>{category}</span>
            </h3>

            <div className="space-y-4">
              {checklist
                .filter(item => item.category === category)
                .map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      item.completed
                        ? 'bg-green-500/10 border-green-500/30'
                        : item.critical
                        ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/30'
                        : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-600/70'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="mt-1"
                      >
                        {item.completed ? (
                          <CheckCircle className="text-green-400" size={20} />
                        ) : (
                          <Circle className="text-slate-400" size={20} />
                        )}
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className={`font-medium ${item.completed ? 'text-green-300' : 'text-white'}`}>
                            {item.title}
                          </h4>
                          {item.critical && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                              Critical
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                        {item.action && (
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-slate-500">Action:</span>
                            <span className="text-purple-400">{item.action}</span>
                            <ExternalLink size={12} className="text-slate-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final Actions */}
      <div className="text-center space-y-4">
        <p className="text-slate-400">
          Once all critical items are complete, you're ready to publish your website!
        </p>
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-slate-600/30 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-700/30 transition-colors"
          >
            <Eye size={16} className="inline mr-2" />
            Preview Site
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!isReadyToPublish}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              isReadyToPublish
                ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                : 'bg-slate-700/30 border border-slate-600/30 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Rocket size={16} className="inline mr-2" />
            {isReadyToPublish ? 'Publish Website' : 'Complete Critical Items First'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PublishReadinessCheck;