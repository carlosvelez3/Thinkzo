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
  const [activeTab, setActiveTab] = useState('overview');
  const [showTeamSection, setShowTeamSection] = useState(true);
  const [editingImages, setEditingImages] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    newContacts: 0,
    activeSubscriptions: 0,
    completedProjects: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'subscriptions') {
      fetchSubscriptions();
    } else if (activeTab === 'usage') {
      fetchUsageLogs();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'logs') {
      fetchAdminLogs();
    }
  }, [activeTab]);

  const fetchOverviewData = async () => {
    try {
      const [usersRes, projectsRes, subscriptionsRes, contactsRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('projects').select('id, status', { count: 'exact' }),
        supabase.from('subscriptions').select('id, status, amount', { count: 'exact' }),
        supabase.from('contacts').select('id', { count: 'exact' }).eq('status', 'new')
      ]);

      const activeProjects = projectsRes.data?.filter(p => p.status === 'in_progress').length || 0;
      const completedProjects = projectsRes.data?.filter(p => p.status === 'completed').length || 0;
      const activeSubscriptions = subscriptionsRes.data?.filter(s => s.status === 'active').length || 0;
      const totalRevenue = subscriptionsRes.data?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

      setStats({
        totalUsers: usersRes.count || 0,
        activeProjects,
        totalRevenue,
        newContacts: contactsRes.count || 0,
        activeSubscriptions,
        completedProjects
      });
    } catch (error: any) {
      toast.error('Failed to fetch overview data');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          user:users!projects_user_id_fkey(full_name, email),
          assigned_user:users!projects_assigned_to_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch projects');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user:users!subscriptions_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch subscriptions');
    }
  };

  const fetchUsageLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('usage_logs')
        .select(`
          *,
          user:users!usage_logs_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsageLogs(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch usage logs');
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          assigned_user:users!contacts_assigned_to_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch contacts');
    }
  };

  const fetchAdminLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          *,
          admin_user:users!admin_logs_admin_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAdminLogs(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch admin logs');
    }
  };

  const updateProjectStatus = async (id: string, status: Project['status']) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.map(project => 
        project.id === id ? { ...project, status } : project
      ));

      await logAdminAction('update_project_status', 'project', id, undefined, { status });
      toast.success('Project status updated');
    } catch (error: any) {
      toast.error('Failed to update project status');
    }
  };

  const updateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status } : contact
      ));

      await logAdminAction('update_contact_status', 'contact', id, undefined, { status });
      toast.success('Contact status updated');
    } catch (error: any) {
      toast.error('Failed to update contact status');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== id));
      await logAdminAction('delete_user', 'user', id, undefined, undefined, 'warning');
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare },
    { id: 'usage', label: 'Usage Logs', icon: Activity },
    { id: 'logs', label: 'Admin Logs', icon: Shield },
    { id: 'content', label: 'Content Management', icon: Settings },
    { id: 'images', label: 'Image Management', icon: Image },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'in_progress': case 'active': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'completed': case 'resolved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'cancelled': case 'expired': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'on_hold': case 'suspended': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 min-h-screen"
        >
          <div className="p-6 border-b border-slate-700/50">
            <h1 className="text-white font-bold text-2xl mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Welcome, {user?.user_metadata?.full_name}</p>
          </div>

          <nav className="p-6">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => setActiveTab(tab.id)}
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
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'purple', trend: '+12%' },
                  { label: 'Active Projects', value: stats.activeProjects, icon: FolderOpen, color: 'blue', trend: '+8%' },
                  { label: 'Completed Projects', value: stats.completedProjects, icon: CheckCircle, color: 'emerald', trend: '+15%' },
                  { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: CreditCard, color: 'pink', trend: '+5%' },
                  { label: 'Monthly Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'lime', trend: '+22%' },
                  { label: 'New Contacts', value: stats.newContacts, icon: MessageSquare, color: 'orange', trend: '+3%' }
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
                      <span className="text-emerald-400 text-sm font-medium">{stat.trend}</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Projects</h3>
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                        <div>
                          <div className="text-white font-medium">{project.title}</div>
                          <div className="text-slate-400 text-sm">{project.project_type}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Contacts</h3>
                  <div className="space-y-3">
                    {contacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                        <div>
                          <div className="text-white font-medium">{contact.name}</div>
                          <div className="text-slate-400 text-sm">{contact.contact_type}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">User Management</h2>
                <button className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-4 py-2 rounded-xl border border-purple-500/20 flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Add User</span>
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="text-left p-4 text-slate-300">Name</th>
                        <th className="text-left p-4 text-slate-300">Email</th>
                        <th className="text-left p-4 text-slate-300">Role</th>
                        <th className="text-left p-4 text-slate-300">Status</th>
                        <th className="text-left p-4 text-slate-300">Created</th>
                        <th className="text-left p-4 text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-slate-700/50">
                          <td className="p-4 text-white">{user.full_name}</td>
                          <td className="p-4 text-slate-300">{user.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-purple-500/20 text-purple-400' 
                                : user.role === 'manager'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-slate-500/20 text-slate-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.is_active 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-400 hover:text-blue-300">
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => deleteUser(user.id)}
                                className="text-red-400 hover:text-red-300"
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
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Project Management</h2>
                <button className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-4 py-2 rounded-xl border border-purple-500/20 flex items-center space-x-2">
                  <Plus size={16} />
                  <span>New Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                        <p className="text-slate-300 mb-3">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>Type: {project.project_type}</span>
                          <span>Budget: {project.budget_range}</span>
                          <span>Progress: {project.progress_percentage}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-slate-400 text-sm">
                        Created: {new Date(project.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={project.status}
                          onChange={(e) => updateProjectStatus(project.id, e.target.value as Project['status'])}
                          className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="on_hold">On Hold</option>
                        </select>
                        <button className="text-blue-400 hover:text-blue-300">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">Contact Management</h2>

              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{contact.name}</h3>
                        <p className="text-slate-300">{contact.email}</p>
                        {contact.company && (
                          <p className="text-slate-400 text-sm">{contact.company}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(contact.priority)}`}>
                          {contact.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-300">{contact.message}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <select
                        value={contact.status}
                        onChange={(e) => updateContactStatus(contact.id, e.target.value as Contact['status'])}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-purple-500/30 transition-colors">
                        <Mail size={14} />
                        <span>Reply</span>
                      </button>
          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Content Management</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team Section Control */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Users size={20} />
                    <span>Team Section</span>
                  </h3>
                  <p className="text-slate-400 mb-6">Control the visibility of the "Meet Your Team" section on the About page.</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">Show Team Section</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowTeamSection(!showTeamSection)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        showTeamSection ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: showTeamSection ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      />
                    </motion.button>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2 text-sm">
                    {showTeamSection ? (
                      <>
                        <Eye className="text-emerald-400" size={16} />
                        <span className="text-emerald-400">Team section is visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="text-red-400" size={16} />
                        <span className="text-red-400">Team section is hidden</span>
                      </>
                    )}
                  </div>
                </div>
                    </div>
                {/* Other Content Controls */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Other Controls</h3>
                  <div className="space-y-4">
                    <button className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white hover:bg-slate-700 transition-colors text-left">
                      Edit Homepage Content
                    </button>
                    <button className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white hover:bg-slate-700 transition-colors text-left">
                      Manage Services Content
                    </button>
                    <button className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white hover:bg-slate-700 transition-colors text-left">
                      Update Pricing Information
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
                  </div>
          {/* Image Management Tab */}
          {activeTab === 'images' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Image Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingImages(!editingImages)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    editingImages
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                      : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  <Edit size={16} />
                  <span>{editingImages ? 'Stop Editing' : 'Start Editing'}</span>
                </motion.button>
              </div>
                ))}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hero Images */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
                  <div className="space-y-3">
                    <div className="relative group">
                      <img 
                        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400" 
                        alt="Hero background" 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {editingImages && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-purple-500/30 border border-purple-500/50 text-white px-3 py-1 rounded text-sm">
                            Change Image
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">Main hero background</p>
                  </div>
                </div>
              </div>
                {/* Team Images */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Team Photos</h3>
                  <div className="space-y-3">
                    {[
                      'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
                      'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400',
                      'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400'
                    ].map((src, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={src} 
                          alt={`Team member ${index + 1}`} 
                          className="w-full h-16 object-cover rounded-lg"
                        />
                        {editingImages && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-purple-500/30 border border-purple-500/50 text-white px-2 py-1 rounded text-xs">
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
            </motion.div>
                {/* Service Images */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Service Icons</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Brain', 'Palette', 'Smartphone', 'TrendingUp', 'Shield', 'Zap'].map((icon, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 text-xs">{icon}</span>
                        </div>
                        {editingImages && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-purple-500/30 border border-purple-500/50 text-white px-2 py-1 rounded text-xs">
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          )}
              {editingImages && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Image Editing Mode Active</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Hover over any image to see edit options. You can upload new images, adjust positioning, 
                    or modify alt text for better SEO.
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm">
                      Upload New Images
                    </button>
                    <button className="bg-slate-700/50 border border-slate-600 text-slate-300 px-4 py-2 rounded-xl text-sm">
                      Bulk Edit Alt Text
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Other tabs would be implemented similarly... */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;