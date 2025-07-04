/**
 * Supabase Client Configuration
 * Handles database connections and authentication
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'manager';
  avatar_url?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  bio?: string;
  is_active: boolean;
  last_login?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  project_type: 'website' | 'mobile_app' | 'branding' | 'marketing' | 'consulting' | 'other';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget_range?: string;
  estimated_hours?: number;
  actual_hours: number;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  requirements: Record<string, any>;
  deliverables: string[];
  tags: string[];
  assigned_to?: string;
  progress_percentage: number;
  client_feedback?: string;
  internal_notes?: string;
  is_billable: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'suspended' | 'trial';
  billing_cycle: 'monthly' | 'yearly' | 'one_time';
  amount: number;
  currency: string;
  trial_ends_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancelled_at?: string;
  features: Record<string, any>;
  usage_limits: Record<string, any>;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  duration_ms?: number;
  success: boolean;
  error_message?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AdminLog {
  id: string;
  admin_user_id?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description?: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  contact_type: 'general' | 'support' | 'sales' | 'feedback' | 'bug_report' | 'feature_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  source: string;
  tags: string[];
  attachments: string[];
  response_sent: boolean;
  response_date?: string;
  satisfaction_rating?: number;
  follow_up_required: boolean;
  follow_up_date?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

// Utility functions for logging
export const logUsage = async (
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  try {
    const { error } = await supabase
      .from('usage_logs')
      .insert([
        {
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {},
          success: true,
        },
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to log usage:', error);
  }
};

export const logAdminAction = async (
  action: string,
  targetType?: string,
  targetId?: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
) => {
  try {
    const { error } = await supabase
      .from('admin_logs')
      .insert([
        {
          action,
          target_type: targetType,
          target_id: targetId,
          old_values: oldValues,
          new_values: newValues,
          severity,
        },
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// Contact insertion function
export const insertContact = async (contactData: Partial<Contact>) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          ...contactData,
          status: contactData.status || 'new',
          tags: contactData.tags || [],
          attachments: contactData.attachments || [],
          response_sent: contactData.response_sent || false,
          follow_up_required: contactData.follow_up_required || false,
        },
      ])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Failed to insert contact:', error);
    return { data: null, error };
  }
};