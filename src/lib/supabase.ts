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

// Schema validation utilities
export const introspectTable = async (tableName: string) => {
  try {
    const { data, error } = await supabase.rpc('introspect_columns', {
      table_name: tableName
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Failed to introspect table:', error.message);
    return { data: null, error };
  }
};

export const getTableInfo = async (tableName: string) => {
  try {
    const { data, error } = await supabase.rpc('get_table_info', {
      table_name: tableName
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Failed to get table info:', error.message);
    return { data: null, error };
  }
};

export const validateUserData = (userData: Partial<User>) => {
  const allowedFields = [
    'email', 'full_name', 'role', 'avatar_url', 'phone', 
    'company', 'job_title', 'bio', 'is_active', 'email_verified'
  ];
  
  const validatedData: Partial<User> = {};
  
  Object.keys(userData).forEach(key => {
    if (allowedFields.includes(key) && userData[key as keyof User] !== undefined) {
      validatedData[key as keyof User] = userData[key as keyof User];
    }
  });
  
  return validatedData;
};

// Enhanced user insertion function using database function
export const insertUser = async (userData: {
  email: string;
  full_name: string;
  phone?: string;
  company?: string;
  job_title?: string;
  bio?: string;
  role?: 'user' | 'admin' | 'manager';
}) => {
  try {
    const { data, error } = await supabase.rpc('safe_insert_user', {
      p_email: userData.email,
      p_full_name: userData.full_name,
      p_phone: userData.phone || null,
      p_company: userData.company || null,
      p_job_title: userData.job_title || null,
      p_bio: userData.bio || null,
      p_role: userData.role || 'user'
    });

    if (error) throw error;

    if (!data.success) {
      throw new Error(data.error);
    }

    return { data: data.data, error: null };
  } catch (error: any) {
    console.error('Failed to insert user:', error.message);
    return { data: null, error };
  }
};

// Enhanced contact insertion function using database function
export const insertContact = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  contact_type?: Contact['contact_type'];
  priority?: Contact['priority'];
  source?: string;
}) => {
  try {
    const { data, error } = await supabase.rpc('safe_insert_contact', {
      p_name: contactData.name,
      p_email: contactData.email,
      p_phone: contactData.phone || null,
      p_company: contactData.company || null,
      p_subject: contactData.subject || null,
      p_message: contactData.message,
      p_contact_type: contactData.contact_type || 'general',
      p_priority: contactData.priority || 'medium',
      p_source: contactData.source || 'website'
    });

    if (error) throw error;

    if (!data.success) {
      throw new Error(data.error);
    }

    return { data: data.data, error: null };
  } catch (error: any) {
    console.error('Failed to insert contact:', error.message);
    return { data: null, error };
  }
};

// Project creation function
export const createProject = async (projectData: {
  title: string;
  description?: string;
  project_type: Project['project_type'];
  budget_range?: string;
  estimated_hours?: number;
  priority?: Project['priority'];
  requirements?: Record<string, any>;
  deliverables?: string[];
  tags?: string[];
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        user_id: user.id,
        status: 'pending',
        priority: projectData.priority || 'medium',
        actual_hours: 0,
        progress_percentage: 0,
        requirements: projectData.requirements || {},
        deliverables: projectData.deliverables || [],
        tags: projectData.tags || [],
        is_billable: true
      }])
      .select()
      .single();

    if (error) throw error;

    // Log the project creation
    await logUsage('project_created', 'project', data.id, { 
      type: projectData.project_type,
      title: projectData.title 
    });

    return { data, error: null };
  } catch (error: any) {
    console.error('Failed to create project:', error.message);
    return { data: null, error };
  }
};

// Dynamic user insertion with schema validation
export const insertUserDynamic = async (userData: Record<string, any>) => {
  try {
    // First, introspect the users table to see what columns exist
    const { data: columns, error: introspectError } = await introspectTable('users');
    
    if (introspectError) {
      console.error('Failed to introspect table schema:', introspectError.message);
      // Fallback to basic insertion
      return await insertUser(userData as any);
    }

    const columnNames = columns?.map((col: any) => col.name) || [];
    
    // Filter userData to only include existing columns
    const filteredData: Record<string, any> = {};
    Object.keys(userData).forEach(key => {
      if (columnNames.includes(key) && userData[key] !== undefined) {
        filteredData[key] = userData[key];
      }
    });

    // Remove phone if it doesn't exist in the schema
    if (!columnNames.includes('phone')) {
      delete filteredData.phone;
    }

    // Use the safe_insert_user function for better validation
    return await insertUser(filteredData as any);
  } catch (error: any) {
    console.error('Dynamic user insertion failed:', error.message);
    return { data: null, error };
  }
};

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