import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://clzltnmucgkzupjgewut.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsemx0bm11Y2drenVwamdld3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODczODMsImV4cCI6MjA2NjI2MzM4M30.LuM3daYe0UdGhfJsIkXVb-Gd8KzCYTxqnEl_hRl9lLE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

