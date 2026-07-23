import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseSecretKey) {
  console.warn("[SUPABASE] Missing env variables for Supabase client");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
