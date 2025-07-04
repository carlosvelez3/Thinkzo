import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Edit3, 
  FileText, 
  Inbox, 
  Shield, 
  Users, 
  Activity,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProjectSubmission {
  id: string;
  project_type: string;
  goals: string;
  timeline: string;
  budget: string;
  additional_notes: string;
  submitted_at: string;
  status: 'new' | 'reviewed' | 'contacted';
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [projectSubmissions, setProjectSubmissions] = useState<ProjectSubmission[]>([]);
  const [accessLogs, setAccessLogs] = useState<Array<{
    id: string;
    timestamp: string;
    action: string;
    user: string;
    ip: string;
  }>>([]);

  // Mock data - in production, this would come from your backend
  useEffect(() => {
    // Mock project submissions
    setProjectSubmissions([
      {
        id: '1',
        project_type: 'website',
        goals: 'Create a modern e-commerce platform',
        timeline: 'month',
        budget: '5000-10000',
        additional_notes: 'Need integration with existing inventory system',
        submitted_at: '2024-01-15T10:30:00Z',
        status: 'new'
      },
      {
        id: '2',
        project_type: 'mobile_app',
        goals: 'Develop a fitness tracking app',
        timeline: '1-3_months',
        budget: '10000+',
        additional_notes: 'iOS and Android versions needed',
        submitted_at: '2024-01-14T15:45:00Z',
        status: 'reviewed'
      }
    ]);

    // Mock access logs
    setAccessLogs([
      {
        id: '1',
        timestamp: '2024-01-15T12:00:00Z',
        action: 'Admin Login',
        user: 'admin',
        ip: '192.168.1.100'
      },
      {
        id: '2',
        timestamp: '2024-01-15T11:30:00Z',
        action: 'Homepage Edit',
        user: 'admin',
        ip: '192.168.1.100'
      }
    ]);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const updateSubmissionStatus = (id: string, status: ProjectSubmission['status']) => {
    setProjectSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status } : sub)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-lime-400 bg-lime-400/10 border-lime-400/30';
      case 'reviewed': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'contacted': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'homepage', label: 'Edit Homepage', icon: Edit3 },
    { id: 'modal', label: 'Edit Start Project Modal', icon: FileText },
    { id: 'submissions', label: 'Project Submissions', icon: Inbox },
    { id: 'logs', label: 'Security Access Logs', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 min-h-screen"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                <p className="text-slate-400 text-sm">Neural Control Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="text-purple-400" size={16} />
              <span className="text-slate-300">Welcome, {user?.username}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-slate-400">Monitor your neural-powered website performance</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Project Submissions', value: projectSubmissions.length, icon: Inbox, color: 'purple' },
                  { label: 'New Inquiries', value: projectSubmissions.filter(s => s.status === 'new').length, icon: Mail, color: 'lime' },
                  { label: 'Active Sessions', value: '1', icon: Activity, color: 'pink' },
                  { label: 'Security Events', value: accessLogs.length, icon: Shield, color: 'blue' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className={`text-${stat.color}-400`} size={24} />
                      <span className="text-3xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {accessLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl">
                      <Calendar className="text-slate-400" size={16} />
                      <div className="flex-1">
                        <span className="text-white">{log.action}</span>
                        <span className="text-slate-400 text-sm ml-2">by {log.user}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{formatDate(log.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'homepage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Edit Homepage</h2>
                <p className="text-slate-400">Modify homepage content and sections</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Homepage Editor</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-4 py-2 rounded-xl border border-purple-500/20"
                  >
                    <ExternalLink size={16} />
                    <span>Preview Changes</span>
                  </motion.button>
                </div>
                
                <div className="text-slate-400">
                  <p>Homepage editing interface would be implemented here.</p>
                  <p className="mt-2">Features would include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Visual content editor</li>
                    <li>Section management</li>
                    <li>Image upload and management</li>
                    <li>SEO settings</li>
                    <li>Version control</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'modal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Edit Start Project Modal</h2>
                <p className="text-slate-400">Customize the project submission form</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Modal Configuration</h3>
                <div className="text-slate-400">
                  <p>Modal editor interface would be implemented here.</p>
                  <p className="mt-2">Features would include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Form field management</li>
                    <li>Validation rules</li>
                    <li>Success message customization</li>
                    <li>Email notification settings</li>
                    <li>Integration options</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'submissions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Project Submissions</h2>
                  <p className="text-slate-400">Manage incoming project requests</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Inbox size={16} />
                  <span>{projectSubmissions.length} total submissions</span>
                </div>
              </div>

              <div className="space-y-4">
                {projectSubmissions.map((submission) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {submission.project_type.replace('_', ' ').toUpperCase()} Project
                        </h3>
                        <p className="text-slate-300">{submission.goals}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                          {submission.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-sm">{formatDate(submission.submitted_at)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-slate-400 text-sm">Timeline:</span>
                        <p className="text-white">{submission.timeline.replace('_', '-')}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Budget:</span>
                        <p className="text-white">${submission.budget.replace('-', ' - $')}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Type:</span>
                        <p className="text-white">{submission.project_type.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {submission.additional_notes && (
                      <div className="mb-4">
                        <span className="text-slate-400 text-sm">Additional Notes:</span>
                        <p className="text-slate-300 mt-1">{submission.additional_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => updateSubmissionStatus(submission.id, 'reviewed')}
                        className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl text-sm hover:bg-yellow-500/30 transition-colors"
                      >
                        Mark as Reviewed
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => updateSubmissionStatus(submission.id, 'contacted')}
                        className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-sm hover:bg-emerald-500/30 transition-colors"
                      >
                        Mark as Contacted
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-purple-500/30 transition-colors"
                      >
                        <Mail size={14} />
                        <span>Send Email</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'logs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Security Access Logs</h2>
                <p className="text-slate-400">Monitor system access and security events</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Access Events</h3>
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <Shield className="text-purple-400" size={20} />
                        <div>
                          <p className="text-white font-medium">{log.action}</p>
                          <p className="text-slate-400 text-sm">User: {log.user} • IP: {log.ip}</p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm">{formatDate(log.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;