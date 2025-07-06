/**
 * Team Manager Component
 * Manage team members with full CRUD operations
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, User, Image, Link } from 'lucide-react';
import { useContent, TeamMember } from '../../hooks/useContent';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const TeamManager: React.FC = () => {
  const { teamMembers, refreshContent } = useContent();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    social_links: { linkedin: '', twitter: '', github: '' },
    display_order: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      social_links: { linkedin: '', twitter: '', github: '' },
      display_order: teamMembers.length + 1
    });
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || '',
      social_links: member.social_links || { linkedin: '', twitter: '', github: '' },
      display_order: member.display_order
    });
  };

  const handleSave = async () => {
    try {
      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from('team_members')
          .update({
            name: formData.name,
            role: formData.role,
            bio: formData.bio,
            image_url: formData.image_url,
            social_links: formData.social_links,
            display_order: formData.display_order
          })
          .eq('id', editingMember.id);

        if (error) throw error;
        toast.success('Team member updated successfully!');
      } else {
        // Create new member
        const { error } = await supabase
          .from('team_members')
          .insert([{
            name: formData.name,
            role: formData.role,
            bio: formData.bio,
            image_url: formData.image_url,
            social_links: formData.social_links,
            display_order: formData.display_order,
            is_active: true
          }]);

        if (error) throw error;
        toast.success('Team member created successfully!');
      }

      setEditingMember(null);
      setIsCreating(false);
      resetForm();
      refreshContent();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save team member');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Team member deleted successfully!');
      refreshContent();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete team member');
    }
  };

  const handleCancel = () => {
    setEditingMember(null);
    setIsCreating(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Management</h2>
          <p className="text-slate-400">Manage your team members and their profiles</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsCreating(true);
            resetForm();
          }}
          className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-colors"
        >
          <Plus size={16} />
          <span>Add Team Member</span>
        </motion.button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingMember) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Role *</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="CEO & Founder"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                placeholder="Brief bio about the team member..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.social_links.linkedin}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  social_links: { ...formData.social_links, linkedin: e.target.value }
                })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Twitter URL</label>
              <input
                type="url"
                value={formData.social_links.twitter}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  social_links: { ...formData.social_links, twitter: e.target.value }
                })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.social_links.github}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  social_links: { ...formData.social_links, github: e.target.value }
                })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center space-x-2 border border-slate-600/30 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700/30 transition-colors"
            >
              <X size={16} />
              <span>Cancel</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group hover:bg-slate-800/70 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400 text-sm">#{member.display_order}</div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="text-center">
              {member.image_url ? (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-purple-500/30"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-purple-400" size={32} />
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
              <div className="text-purple-400 font-medium mb-3">{member.role}</div>
              
              {member.bio && (
                <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {member.bio}
                </p>
              )}

              <div className="flex justify-center space-x-2">
                {member.social_links?.linkedin && (
                  <a
                    href={member.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all duration-300"
                  >
                    <Link size={14} />
                  </a>
                )}
                {member.social_links?.twitter && (
                  <a
                    href={member.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all duration-300"
                  >
                    <Link size={14} />
                  </a>
                )}
                {member.social_links?.github && (
                  <a
                    href={member.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-slate-700 transition-all duration-300"
                  >
                    <Link size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <User className="text-slate-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No Team Members</h3>
          <p className="text-slate-400 mb-6">Add your first team member to get started.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsCreating(true);
              resetForm();
            }}
            className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-6 py-3 rounded-xl hover:bg-purple-500/30 transition-colors mx-auto"
          >
            <Plus size={16} />
            <span>Add Team Member</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default TeamManager;