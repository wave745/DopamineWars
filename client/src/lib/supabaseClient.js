import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for now - these will be replaced with environment variables in production
// In a real-world application, you would use environment variables securely
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);