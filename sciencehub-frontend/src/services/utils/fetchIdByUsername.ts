import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";

export async function fetchIdByUsername(
    supabase: SupabaseClient<Database>,
    username: string
): Promise<string | null> {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

    if (error) {
        console.error("Error fetching user ID:", error);
        return null;
    }

    return data?.id || null;
}
