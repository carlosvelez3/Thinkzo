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
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: number;
  category: string;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface AdminLog {
  id: string;
  user_id: string;
  action: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}