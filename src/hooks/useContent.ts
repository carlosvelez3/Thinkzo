/**
 * Content Management Hook
 * Manages dynamic content from the CMS
 */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: any;
  is_published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  social_links: any;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  display_order: number;
  is_active: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  updated_at: string;
}

export const useContent = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      
      const [sectionsRes, teamRes, navRes, settingsRes] = await Promise.all([
        supabase.from('content_sections').select('*').eq('is_published', true),
        supabase.from('team_members').select('*').eq('is_active', true).order('display_order'),
        supabase.from('navigation_items').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_settings').select('*')
      ]);

      if (sectionsRes.data) setContentSections(sectionsRes.data);
      if (teamRes.data) setTeamMembers(teamRes.data);
      if (navRes.data) setNavigationItems(navRes.data);
      if (settingsRes.data) setSiteSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentSection = (sectionKey: string) => {
    return contentSections.find(section => section.section_key === sectionKey);
  };

  const getSiteSetting = (settingKey: string) => {
    const setting = siteSettings.find(s => s.setting_key === settingKey);
    return setting?.setting_value;
  };

  const updateContentSection = async (sectionKey: string, content: any) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({ content })
        .eq('section_key', sectionKey);

      if (error) throw error;
      await fetchAllContent();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateSiteSetting = async (settingKey: string, settingValue: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ setting_key: settingKey, setting_value: settingValue });

      if (error) throw error;
      await fetchAllContent();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    contentSections,
    teamMembers,
    navigationItems,
    siteSettings,
    loading,
    getContentSection,
    getSiteSetting,
    updateContentSection,
    updateSiteSetting,
    refreshContent: fetchAllContent
  };
};