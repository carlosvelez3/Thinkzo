import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit3, Save, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: any;
  is_published: boolean;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
}

const AdminDashboard: React.FC = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load content sections
      const { data: sections } = await supabase
        .from('content_sections')
        .select('*')
        .order('section_key');

      // Load site settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key');

      setContentSections(sections || []);
      setSiteSettings(settings || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContentSection = async (id: string, updates: Partial<ContentSection>) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setContentSections(prev => 
        prev.map(section => 
          section.id === id ? { ...section, ...updates } : section
        )
      );
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating content section:', error);
    }
  };

  const updateSiteSetting = async (id: string, updates: Partial<SiteSetting>) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setSiteSettings(prev => 
        prev.map(setting => 
          setting.id === id ? { ...setting, ...updates } : setting
        )
      );
      setEditingSetting(null);
    } catch (error) {
      console.error('Error updating site setting:', error);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    await updateContentSection(id, { is_published: !currentStatus });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-poppins text-white mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-300">Manage your website content and settings</p>
        </div>

        {/* Site Settings Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Edit3 size={24} />
            Site Settings
          </h2>
          <div className="grid gap-6">
            {siteSettings.map((setting) => (
              <div key={setting.id} className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{setting.setting_key}</h3>
                    <p className="text-gray-400 text-sm">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => setEditingSetting(editingSetting === setting.id ? null : setting.id)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {editingSetting === setting.id ? <X size={20} /> : <Edit3 size={20} />}
                  </button>
                </div>

                {editingSetting === setting.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={JSON.stringify(setting.setting_value, null, 2)}
                      onChange={(e) => {
                        try {
                          const newValue = JSON.parse(e.target.value);
                          setSiteSettings(prev =>
                            prev.map(s => s.id === setting.id ? { ...s, setting_value: newValue } : s)
                          );
                        } catch (error) {
                          // Handle invalid JSON
                        }
                      }}
                      className="w-full p-4 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 font-mono text-sm"
                      rows={6}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateSiteSetting(setting.id, { setting_value: setting.setting_value })}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        <Save size={16} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingSetting(null)}
                        className="btn-secondary text-sm py-2 px-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-navy-900/30 rounded-lg p-4">
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      {JSON.stringify(setting.setting_value, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Edit3 size={24} />
            Content Sections
          </h2>
          <div className="grid gap-6">
            {contentSections.map((section) => (
              <div key={section.id} className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-navy-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                    <p className="text-gray-400 text-sm">Section: {section.section_key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(section.id, section.is_published)}
                      className={`p-2 rounded-lg transition-colors ${
                        section.is_published 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                      title={section.is_published ? 'Published' : 'Unpublished'}
                    >
                      {section.is_published ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    <button
                      onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {editingSection === section.id ? <X size={20} /> : <Edit3 size={20} />}
                    </button>
                  </div>
                </div>

                {editingSection === section.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        setContentSections(prev =>
                          prev.map(s => s.id === section.id ? { ...s, title: e.target.value } : s)
                        );
                      }}
                      className="w-full p-3 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      placeholder="Section title"
                    />
                    <textarea
                      value={JSON.stringify(section.content, null, 2)}
                      onChange={(e) => {
                        try {
                          const newContent = JSON.parse(e.target.value);
                          setContentSections(prev =>
                            prev.map(s => s.id === section.id ? { ...s, content: newContent } : s)
                          );
                        } catch (error) {
                          // Handle invalid JSON
                        }
                      }}
                      className="w-full p-4 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 font-mono text-sm"
                      rows={8}
                      placeholder="Content (JSON format)"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateContentSection(section.id, { 
                          title: section.title, 
                          content: section.content 
                        })}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        <Save size={16} className="mr-1" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        className="btn-secondary text-sm py-2 px-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-navy-900/30 rounded-lg p-4">
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      {JSON.stringify(section.content, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;