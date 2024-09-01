import { Database } from "@/types_db";
import { createClient } from "@supabase/supabase-js";

/**
 * Create supabase client
 */
export default createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
);
