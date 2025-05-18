import { createClient } from '@supabase/supabase-js';
import { apiRequest } from '@/lib/queryClient';

// Create a Supabase client with the URL and anon key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication Service functions
export const authService = {
  // Sign in with OTP (one-time password)
  async signInWithOtp(email) {
    try {
      const response = await apiRequest('POST', '/api/auth/signin', { email });
      return { success: true, data: response };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error };
    }
  },

  // Sign out the user
  async signOut() {
    try {
      await apiRequest('POST', '/api/auth/signout');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error };
    }
  },

  // Get the current session
  async getSession() {
    try {
      const response = await apiRequest('GET', '/api/auth/session');
      return { success: true, data: response.session };
    } catch (error) {
      console.error('Get session error:', error);
      return { success: false, error };
    }
  }
};