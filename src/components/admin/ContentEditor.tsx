/**
 * Content Editor Component
 * Rich editor for managing website content
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit, Eye, Plus, Trash2, Image, Type, Settings } from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ContentEditorProps {
  sectionKey?: string;
  onClose?: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ sectionKey, onClose }) => {
  const { getContentSection, updateContentSection } = useContent();
  const [editingContent, setEditingContent] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sectionKey) {
      const section = getContentSection(sectionKey);
      if (section) {
        setEditingContent(section.content);
      }
    }
  }, [sectionKey, getContentSection]);

  const handleSave = async () => {
    if (!sectionKey) return;
    
    setSaving(true);
    try {
      const result = await updateContentSection(sectionKey, editingContent);
      if (result.success) {
        toast.success('Content updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to update content');
      }
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...editingContent };
    let current = newContent;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setEditingContent(newContent);
  };

  const renderField = (key: string, value: any, path: string = key) => {
    if (typeof value === 'string') {
      return (
        <div key={path} className="mb-4">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          {value.length > 100 ? (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(path, e.target.value)}
              disabled={!isEditing}
              rows={4}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none disabled:opacity-50"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(path, e.target.value)}
              disabled={!isEditing}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
            />
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={path} className="mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-3">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="space-y-4">
            {value.map((item, index) => (
              <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-sm">Item {index + 1}</span>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newArray = [...value];
                        newArray.splice(index, 1);
                        handleInputChange(path, newArray);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {typeof item === 'object' ? (
                  Object.entries(item).map(([subKey, subValue]) => 
                    renderField(subKey, subValue, `${path}.${index}.${subKey}`)
                  )
                ) : (
                  renderField(`item_${index}`, item, `${path}.${index}`)
                )}
              </div>
            ))}
            {isEditing && (
              <button
                onClick={() => {
                  const newItem = typeof value[0] === 'object' 
                    ? Object.keys(value[0]).reduce((acc, k) => ({ ...acc, [k]: '' }), {})
                    : '';
                  handleInputChange(path, [...value, newItem]);
                }}
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={path} className="mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-3">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50 space-y-4">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderField(subKey, subValue, `${path}.${subKey}`)
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (!sectionKey) {
    return (
      <div className="text-center py-12">
        <Type className="text-slate-400 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">Select Content to Edit</h3>
        <p className="text-slate-400">Choose a content section from the sidebar to start editing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Edit {sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
          <p className="text-slate-400">Modify the content for this section</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-colors"
            >
              <Edit size={16} />
              <span>Edit</span>
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(false);
                  // Reset content
                  const section = getContentSection(sectionKey);
                  if (section) setEditingContent(section.content);
                }}
                className="flex items-center space-x-2 border border-slate-600/30 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700/30 transition-colors"
              >
                <Eye size={16} />
                <span>Cancel</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        {Object.entries(editingContent).map(([key, value]) => 
          renderField(key, value)
        )}
        
        {Object.keys(editingContent).length === 0 && (
          <div className="text-center py-8">
            <Settings className="text-slate-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">No Content Found</h3>
            <p className="text-slate-400">This section doesn't have any content yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;