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
  metadata?: Record<string, any>;
  ai_qualification?: Record<string, any>;
  qualification_status?: 'HOT' | 'WARM' | 'COLD';
  qualification_score?: number;
  created_at: string;
  updated_at: string;
}

// Legacy interface for backward compatibility
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  service_type?: string;
  budget_range?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

// Service interface for services page
export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: number;
  category: string;
  image_url?: string;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

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
      p_phone: userData.phone,
      p_company: userData.company,
      p_job_title: userData.job_title,
      p_bio: userData.bio,
      p_role: userData.role
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
  metadata?: Record<string, any>;
}) => {
  try {
    const { data, error } = await supabase.rpc('safe_insert_contact', {
      p_name: contactData.name,
      p_email: contactData.email,
      p_message: contactData.message,
      p_phone: contactData.phone,
      p_company: contactData.company,
      p_subject: contactData.subject,
      p_contact_type: contactData.contact_type,
      p_priority: contactData.priority,
      p_source: contactData.source,
      p_metadata: contactData.metadata
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

// AI Lead Qualification function
export const qualifyLead = async (contactId: string) => {
  try {
    // Get contact data
    const { data: contact, error: contactError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', contactId)
      .single();

    if (contactError) throw contactError;

    // Prepare lead data for AI qualification
    const leadData = {
      lead_name: contact.name,
      lead_email: contact.email,
      company_name: contact.company,
      company_website: contact.metadata?.company_website,
      project_goals: contact.metadata?.project_goals || contact.message,
      budget: contact.metadata?.budget_range || 'Not specified',
      timeline: contact.metadata?.timeline || 'Not specified',
      service_type: contact.metadata?.service_type,
      additional_notes: contact.message,
      source: 'contact_form'
    };

    // Call AI qualification function
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lead-qualifier`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const qualificationResult = await response.json();

    // Update contact with AI qualification
    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({
        ai_qualification: qualificationResult,
        qualification_status: qualificationResult.qualification_status,
        qualification_score: qualificationResult.confidence_score
      })
      .eq('id', contactId);

    if (updateError) throw updateError;

    return { data: qualificationResult, error: null };
  } catch (error: any) {
    console.error('Lead qualification error:', error);
    return { data: null, error };
  }
};

// Legacy contact message insertion for backward compatibility
export const insertContactMessage = async (messageData: {
  name: string;
  email: string;
  company?: string;
  service_type?: string;
  budget_range?: string;
  message: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          ...messageData,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Log the contact creation
    await logUsage('contact_message_created', 'contact_message', data.id, { 
      email: messageData.email,
      service_type: messageData.service_type 
    });

    return { data, error: null };
  } catch (error: any) {
    console.error('Failed to insert contact message:', error.message);
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

// Data validation utilities
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

export const validateContactData = (contactData: Partial<Contact>) => {
  const allowedFields = [
    'name', 'email', 'phone', 'company', 'subject', 'message',
    'contact_type', 'priority', 'source'
  ];
  
  const validatedData: Partial<Contact> = {};
  
  Object.keys(contactData).forEach(key => {
    if (allowedFields.includes(key) && contactData[key as keyof Contact] !== undefined) {
      validatedData[key as keyof Contact] = contactData[key as keyof Contact];
    }
  });
  
  return validatedData;
};

// Error handling utilities
export const handleSupabaseError = (error: any) => {
  if (error?.code === 'PGRST116') {
    return 'No data found';
  }
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  if (error?.code === '23503') {
    return 'Referenced record does not exist';
  }
  return error?.message || 'An unexpected error occurred';
};

// Query builders for common operations
export const buildUserQuery = (includeInactive = false) => {
  let query = supabase.from('users').select('*');
  
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  
  return query.order('created_at', { ascending: false });
};

export const buildProjectQuery = (userId?: string, status?: Project['status']) => {
  let query = supabase.from('projects').select(`
    *,
    user:users!projects_user_id_fkey(full_name, email),
    assigned_user:users!projects_assigned_to_fkey(full_name, email)
  `);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  return query.order('created_at', { ascending: false });
};

export const buildContactQuery = (status?: Contact['status']) => {
  let query = supabase.from('contacts').select(`
    *,
    assigned_user:users!contacts_assigned_to_fkey(full_name, email)
  `);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  return query.order('created_at', { ascending: false });
};