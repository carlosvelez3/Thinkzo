/**
 * Site Settings Component
 * Manage global site settings and configuration
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, Globe, Palette, Link, Mail, Phone, MapPin } from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const SiteSettings: React.FC = () => {
  const { siteSettings, refreshContent } = useContent();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Convert site settings array to object for easier manipulation
    const settingsObj = siteSettings.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {} as Record<string, any>);
    setSettings(settingsObj);
  }, [siteSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update each setting
      const updates = Object.entries(settings).map(([key, value]) => 
        supabase
          .from('site_settings')
          .upsert({ setting_key: key, setting_value: value })
      );

      await Promise.all(updates);
      toast.success('Settings saved successfully!');
      refreshContent();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSocialLink = (platform: string, url: string) => {
    const socialLinks = settings.social_links || {};
    updateSetting('social_links', { ...socialLinks, [platform]: url });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Site Settings</h2>
          <p className="text-slate-400">Manage global site configuration and branding</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="text-purple-400" size={24} />
            <h3 className="text-xl font-semibold text-white">Basic Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Site Title</label>
              <input
                type="text"
                value={settings.site_title || ''}
                onChange={(e) => updateSetting('site_title', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Your Site Title"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Site Description</label>
              <textarea
                value={settings.site_description || ''}
                onChange={(e) => updateSetting('site_description', e.target.value)}
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                placeholder="Brief description of your site..."
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={settings.company_name || ''}
                onChange={(e) => updateSetting('company_name', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Logo Text</label>
              <input
                type="text"
                value={settings.logo_text || ''}
                onChange={(e) => updateSetting('logo_text', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Logo Text"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Footer Text</label>
              <input
                type="text"
                value={settings.footer_text || ''}
                onChange={(e) => updateSetting('footer_text', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="© 2024 Your Company. All rights reserved."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="text-blue-400" size={24} />
            <h3 className="text-xl font-semibold text-white">Contact Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => updateSetting('contact_email', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="contact@yourcompany.com"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.contact_phone || ''}
                onChange={(e) => updateSetting('contact_phone', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Address</label>
              <textarea
                value={settings.contact_address || ''}
                onChange={(e) => updateSetting('contact_address', e.target.value)}
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                placeholder="123 Main Street, City, State 12345"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Business Hours</label>
              <input
                type="text"
                value={settings.business_hours || ''}
                onChange={(e) => updateSetting('business_hours', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Monday - Friday: 9AM - 6PM PST"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <Link className="text-pink-400" size={24} />
            <h3 className="text-xl font-semibold text-white">Social Media Links</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Twitter URL</label>
              <input
                type="url"
                value={settings.social_links?.twitter || ''}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://twitter.com/yourcompany"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={settings.social_links?.linkedin || ''}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Facebook URL</label>
              <input
                type="url"
                value={settings.social_links?.facebook || ''}
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://facebook.com/yourcompany"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={settings.social_links?.github || ''}
                onChange={(e) => updateSocialLink('github', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://github.com/yourcompany"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Instagram URL</label>
              <input
                type="url"
                value={settings.social_links?.instagram || ''}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://instagram.com/yourcompany"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">YouTube URL</label>
              <input
                type="url"
                value={settings.social_links?.youtube || ''}
                onChange={(e) => updateSocialLink('youtube', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://youtube.com/c/yourcompany"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;