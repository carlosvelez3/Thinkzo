/**
 * Enhanced Admin Dashboard
 * Comprehensive admin panel for managing all aspects of the website
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar
} from 'lucide-react';
import { supabase, User, Service, ContactMessage, AdminLog } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    newMessages: 0,
    totalRevenue: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'services') {
      fetchServices();
    } else if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchOverviewData = async () => {
    try {
      // Fetch stats
      const [usersRes, servicesRes, messagesRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('services').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id', { count: 'exact' }).eq('status', 'new')
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalServices: servicesRes.count || 0,
        newMessages: messagesRes.count || 0,
        totalRevenue: 125000 // Mock data
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

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch services');
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch messages');
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*, users(full_name)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch logs');
    }
  };

  const updateMessageStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));

      toast.success('Message status updated');
    } catch (error: any) {
      toast.error('Failed to update message status');
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
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'logs', label: 'Activity Logs', icon: Shield },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-lime-400 bg-lime-400/10 border-lime-400/30';
      case 'read': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'replied': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'purple' },
                  { label: 'Services', value: stats.totalServices, icon: Settings, color: 'pink' },
                  { label: 'New Messages', value: stats.newMessages, icon: MessageSquare, color: 'lime' },
                  { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: BarChart3, color: 'blue' }
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
                                : 'bg-slate-500/20 text-slate-400'
                            }`}>
                              {user.role}
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

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">Contact Messages</h2>

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {message.name}
                        </h3>
                        <p className="text-slate-300">{message.email}</p>
                        {message.company && (
                          <p className="text-slate-400 text-sm">{message.company}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                          {message.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-300">{message.message}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateMessageStatus(message.id, 'read')}
                        className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl text-sm hover:bg-yellow-500/30 transition-colors"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() => updateMessageStatus(message.id, 'replied')}
                        className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-sm hover:bg-emerald-500/30 transition-colors"
                      >
                        Mark as Replied
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