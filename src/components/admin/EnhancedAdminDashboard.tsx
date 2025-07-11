/**
 * Enhanced Admin Dashboard with Full CMS
 * Complete content management system for the entire website
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  Edit3,
  UserCheck,
  Globe,
  Type,
  Image,
  Navigation,
  Palette,
  TestTube,
  LogOut,
  Target
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';
import ContentEditor from './ContentEditor';
import TeamManager from './TeamManager';
import SiteSettings from './SiteSettings';
import SystemHealthCheck from './SystemHealthCheck';
import PublishReadinessCheck from './PublishReadinessCheck';
import TestingPanel from '../TestingPanel';
import LeadQualificationDashboard from './LeadQualificationDashboard';
import ProposalGenerator from './ProposalGenerator';

const EnhancedAdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { contentSections, teamMembers, navigationItems, loading } = useContent();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedContentSection, setSelectedContentSection] = useState<string | null>(null);
  const [showTestingPanel, setShowTestingPanel] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'leads', label: 'Lead Qualification', icon: Target },
    { id: 'proposals', label: 'Proposal Generator', icon: FolderOpen },
    { id: 'content', label: 'Content Editor', icon: Edit3 },
    { id: 'team', label: 'Team Management', icon: UserCheck },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'testing', label: 'System Testing', icon: TestTube },
    { id: 'publish', label: 'Publish Ready', icon: Globe }
  ];

  const contentSectionsList = [
    { key: 'hero', label: 'Hero Section', icon: Globe },
    { key: 'about_mission', label: 'About Mission', icon: Type },
    { key: 'contact_info', label: 'Contact Info', icon: MessageSquare },
    { key: 'company_values', label: 'Company Values', icon: Palette },
    { key: 'process_steps', label: 'Process Steps', icon: FolderOpen }
  ];

  const stats = {
    totalSections: contentSections.length,
    teamMembers: teamMembers.length,
    navigationItems: navigationItems.length,
    lastUpdated: new Date().toLocaleDateString()
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 min-h-screen">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Settings className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin CMS</h1>
                <p className="text-slate-400 text-sm">Content Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="text-purple-400" size={16} />
              <span className="text-slate-300">Welcome, {user?.user_metadata?.full_name || user?.email}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-6">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedContentSection(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                  </motion.button>
                </li>
              ))}
            </ul>

            {/* Content Sections Quick Access */}
            {activeTab === 'content' && (
              <div className="mt-8">
                <h3 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">
                  Content Sections
                </h3>
                <ul className="space-y-1">
                  {contentSectionsList.map((section) => (
                    <li key={section.key}>
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedContentSection(section.key)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                          selectedContentSection === section.key
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'
                        }`}
                      >
                        <section.icon size={16} />
                        <span>{section.label}</span>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signOut()}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">CMS Overview</h2>
                <p className="text-slate-400">Manage your entire website content from one place</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Content Sections', value: stats.totalSections, icon: Type, color: 'purple' },
                  { label: 'Team Members', value: stats.teamMembers, icon: UserCheck, color: 'blue' },
                  { label: 'Navigation Items', value: stats.navigationItems, icon: Navigation, color: 'green' },
                  { label: 'Last Updated', value: stats.lastUpdated, icon: Settings, color: 'pink' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 border border-${stat.color}-500/30 flex items-center justify-center`}>
                        <stat.icon className={`text-${stat.color}-400`} size={24} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab('content')}
                    className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <Edit3 className="text-purple-400" size={20} />
                    <span className="text-white">Edit Content</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab('team')}
                    className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <UserCheck className="text-blue-400" size={20} />
                    <span className="text-white">Manage Team</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <Settings className="text-green-400" size={20} />
                    <span className="text-white">Site Settings</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowTestingPanel(true)}
                    className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <TestTube className="text-orange-400" size={20} />
                    <span className="text-white">Test System</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leads' && <LeadQualificationDashboard />}

          {activeTab === 'proposals' && <ProposalGenerator />}

          {activeTab === 'content' && (
            <ContentEditor 
              sectionKey={selectedContentSection || undefined}
              onClose={() => setSelectedContentSection(null)}
            />
          )}

          {activeTab === 'team' && <TeamManager />}

          {activeTab === 'settings' && <SiteSettings />}

          {activeTab === 'navigation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Navigation Management</h2>
                <p className="text-slate-400">Manage your website navigation menu</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <p className="text-slate-400">Navigation management interface coming soon...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
                <p className="text-slate-400">Manage user accounts and permissions</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <p className="text-slate-400">User management interface coming soon...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Contact Messages</h2>
                <p className="text-slate-400">View and respond to contact form submissions</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <p className="text-slate-400">Message management interface coming soon...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'testing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <SystemHealthCheck />
            </motion.div>
          )}

          {activeTab === 'publish' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <PublishReadinessCheck />
            </motion.div>
          )}
        </div>
      </div>

      {/* Testing Panel */}
      <TestingPanel 
        isOpen={showTestingPanel} 
        onClose={() => setShowTestingPanel(false)} 
      />
    </div>
  );
};

export default EnhancedAdminDashboard;