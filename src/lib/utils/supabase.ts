import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SupabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const SupabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!SupabaseUrl || !SupabaseAnonKey) {
    throw new Error("Faltan las variables de entorno");
}

export const supabase = createClient(SupabaseUrl, SupabaseAnonKey);