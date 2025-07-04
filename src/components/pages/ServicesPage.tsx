/**
 * Services Page Component
 * Displays all services with CRUD capabilities (admin only)
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, DollarSign } from 'lucide-react';
import { supabase, Service } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchServices();
    checkAdminStatus();
  }, [user]);

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
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServices(services.filter(service => service.id !== id));
      toast.success('Service deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete service');
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setServices(services.map(service => 
        service.id === id 
          ? { ...service, is_featured: !currentStatus }
          : service
      ));

      toast.success(`Service ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
    } catch (error: any) {
      toast.error('Failed to update service');
    }
  };

  const filteredServices = services.filter(service => {
    if (filter === 'all') return true;
    if (filter === 'featured') return service.is_featured;
    return service.category === filter;
  });

  const categories = ['all', 'featured', ...Array.from(new Set(services.map(s => s.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of AI-powered solutions designed to transform your business.
            </p>
          </motion.div>

          {/* Admin Controls */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <button className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-purple-500/20 flex items-center space-x-2">
                <Plus size={20} />
                <span>Add New Service</span>
              </button>
            </motion.div>
          )}

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/20'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 border border-slate-700/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-slate-400 text-xl">No services found in this category.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/70 transition-all duration-300 relative group"
                >
                  {/* Featured Badge */}
                  {service.is_featured && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star size={12} />
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => toggleFeatured(service.id, service.is_featured)}
                        className="w-8 h-8 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-full flex items-center justify-center text-yellow-400 transition-colors"
                      >
                        <Star size={16} />
                      </button>
                      <button className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 rounded-full flex items-center justify-center text-blue-400 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  {/* Service Image */}
                  {service.image_url && (
                    <div className="mb-6">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                    </div>
                  )}

                  {/* Service Content */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      <div className="flex items-center space-x-1 text-purple-400">
                        <DollarSign size={16} />
                        <span className="font-semibold">{service.price}</span>
                      </div>
                    </div>
                    
                    <div className="text-purple-400 text-sm font-medium mb-4 uppercase tracking-wide">
                      {service.category}
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-purple-500/20"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;