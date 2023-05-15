import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_KEY } from '$env/static/private';

const supabase: SupabaseClient = createClient(PUBLIC_SUPABASE_URL, SUPABASE_KEY);

export default supabase;
