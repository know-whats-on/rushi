import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://pcgdqsdiidtiziypvqri.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZ2Rxc2RpaWR0aXppeXB2cXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDY2NDksImV4cCI6MjA4NTc4MjY0OX0.yfWSFl5DGoOvSCPpt9Yp2pN4W1N1wUb_lDLDJB7dnh0";

export const RUSHI_PERSONAL_ADMIN_EMAIL = (
  import.meta.env.VITE_RUSHI_PERSONAL_ADMIN_EMAIL || "rushi@knowwhatson.com"
).toLowerCase();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
