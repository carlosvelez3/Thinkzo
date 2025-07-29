/**
 * Authentication Hook
 * Manages user authentication state and operations
 */
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, insertUser } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user profile exists, if not create it
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (!existingUser) {
            // Create user profile after successful authentication
            const { error: profileError } = await insertUser({
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
              role: 'user',
            });

            if (profileError) {
              console.error('Failed to create user profile:', profileError);
              toast.error('Failed to create user profile. Please contact support.');
            }
          }
        }

        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!email.includes('@') || password.length < 6) {
      alert("Please enter a valid email and stronger password.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("❌ Supabase signup error:", error);
        throw error;
      }

      // User profile will be created automatically via trigger or after email confirmation
      // The insertUser function should be called after the user is properly authenticated

      toast.success('Account created successfully! Please check your email to verify your account.');
      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during sign up';
      if (errorMessage.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else if (errorMessage.includes('Password should be')) {
        toast.error('Password must be at least 6 characters long.');
      } else {
        toast.error(errorMessage);
      }
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Signed in successfully!');
      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during sign in';
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('Please check your email and click the confirmation link before signing in.');
      } else {
        toast.error(errorMessage);
      }
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent!');
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while sending reset email';
      if (errorMessage.includes('User not found')) {
        toast.error('No account found with this email address.');
      } else {
        toast.error(errorMessage);
      }
      return { error };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};