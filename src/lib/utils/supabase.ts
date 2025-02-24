import { createClient } from "@supabase/supabase-js";

const SupabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const SupabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SupabaseUrl, SupabaseAnonKey)