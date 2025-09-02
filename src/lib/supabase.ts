import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!')
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  throw new Error('Supabase configuration is required for the application to work')
}
