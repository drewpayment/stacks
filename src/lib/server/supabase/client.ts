import { SUPABASE_API_KEY, SUPABASE_URL } from '$env/static/private';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const isBuild = process.env.NODE_ENV === 'production' && process.env.BUILD_MODE === 'true';
let supabase: SupabaseClient<any, "public", any>;

if (isBuild) {
  supabase = {} as any;
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
}

export { supabase };