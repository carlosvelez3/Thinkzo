/**
 * Enhanced Admin Dashboard
 * Comprehensive admin panel for managing all aspects of the business
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderOpen, 
  CreditCard,
  Activity,
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Image,
  EyeOff
} from 'lucide-react';
import { supabase, User, Project, Subscription, UsageLog, AdminLog, Contact, logAdminAction } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingContacts: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        usersResponse,
        projectsResponse,
        subscriptionsResponse,
        usageLogsResponse,
        adminLogsResponse,
        contactsResponse
      ] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
        supabase.from('usage_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ]);

      if (usersResponse.data) setUsers(usersResponse.data);
      if (projectsResponse.data) setProjects(projectsResponse.data);
      if (subscriptionsResponse.data) setSubscriptions(subscriptionsResponse.data);
      if (usageLogsResponse.data) setUsageLogs(usageLogsResponse.data);
      if (adminLogsResponse.data) setAdminLogs(adminLogsResponse.data);
      if (contactsResponse.data) setContacts(contactsResponse.data);

      // Calculate stats
      const totalRevenue = subscriptionsResponse.data?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;
      const pendingContacts = contactsResponse.data?.filter(contact => contact.status === 'new').length || 0;
      const activeProjects = projectsResponse.data?.filter(project => project.status === 'active').length || 0;

      setStats({
        totalUsers: usersResponse.data?.length || 0,
        activeProjects,
        totalRevenue,
        pendingContacts
      });

      await logAdminAction('dashboard_view', { timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      if (action === 'delete') {
        await supabase.from('users').delete().eq('id', userId);
        toast.success('User deleted successfully');
      } else {
        const newStatus = action === 'activate' ? 'active' : 'inactive';
        await supabase.from('users').update({ status: newStatus }).eq('id', userId);
        toast.success(`User ${action}d successfully`);
      }
      
      await logAdminAction(`user_${action}`, { userId, timestamp: new Date().toISOString() });
      fetchDashboardData();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleContactStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', contactId);
      
      toast.success('Contact status updated');
      await logAdminAction('contact_status_update', { contactId, newStatus, timestamp: new Date().toISOString() });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Failed to update contact status');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 border border-${color}-500/30 flex items-center justify-center`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-${trend > 0 ? 'green' : 'red'}-400 text-sm`}>
            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your business operations and monitor performance</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={Users}
                  color="blue"
                  trend={12}
                />
                <StatCard
                  title="Active Projects"
                  value={stats.activeProjects}
                  icon={FolderOpen}
                  color="green"
                  trend={8}
                />
                <StatCard
                  title="Total Revenue"
                  value={`$${stats.totalRevenue.toLocaleString()}`}
                  icon={CreditCard}
                  color="purple"
                  trend={15}
                />
                <StatCard
                  title="Pending Contacts"
                  value={stats.pendingContacts}
                  icon={MessageSquare}
                  color="orange"
                  trend={-3}
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Users</h3>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.full_name || 'Unknown'}</div>
                            <div className="text-slate-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                        <div className="text-slate-400 text-sm">
                          {new Date(user.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Projects</h3>
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                        <div>
                          <div className="text-white font-medium">{project.title}</div>
                          <div className="text-slate-400 text-sm">{project.type}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {project.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">User Management</h3>
                <button className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-purple-500/30 transition-colors">
                  <Plus size={16} />
                  <span>Add User</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left text-slate-400 font-medium py-3">User</th>
                      <th className="text-left text-slate-400 font-medium py-3">Role</th>
                      <th className="text-left text-slate-400 font-medium py-3">Status</th>
                      <th className="text-left text-slate-400 font-medium py-3">Joined</th>
                      <th className="text-left text-slate-400 font-medium py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700/30">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-white font-medium">{user.full_name || 'Unknown'}</div>
                              <div className="text-slate-400 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            Active
                          </span>
                        </td>
                        <td className="py-4 text-slate-400">
                          {new Date(user.created_at || '').toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-700/50 rounded-lg transition-colors">
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Contact Messages</h3>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="p-6 bg-slate-700/30 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-white font-medium mb-1">{contact.name}</div>
                        <div className="text-slate-400 text-sm">{contact.email}</div>
                        {contact.company && (
                          <div className="text-slate-400 text-sm">{contact.company}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'new' ? 'bg-orange-500/20 text-orange-400' :
                          contact.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {contact.status}
                        </span>
                        <div className="text-slate-400 text-sm">
                          {new Date(contact.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-slate-300 mb-4 leading-relaxed">
                      {contact.message}
                    </div>
                    
                    {(contact.service_type || contact.budget_range) && (
                      <div className="flex items-center space-x-4 mb-4 text-sm">
                        {contact.service_type && (
                          <div className="text-slate-400">
                            Service: <span className="text-purple-400">{contact.service_type}</span>
                          </div>
                        )}
                        {contact.budget_range && (
                          <div className="text-slate-400">
                            Budget: <span className="text-green-400">{contact.budget_range}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleContactStatusUpdate(contact.id, 'read')}
                        className="flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm hover:bg-blue-500/30 transition-colors"
                      >
                        <CheckCircle size={14} />
                        <span>Mark Read</span>
                      </button>
                      <button 
                        onClick={() => handleContactStatusUpdate(contact.id, 'replied')}
                        className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-sm hover:bg-green-500/30 transition-colors"
                      >
                        <CheckCircle size={14} />
                        <span>Mark Replied</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-purple-500/30 transition-colors">
                        <Mail size={14} />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;