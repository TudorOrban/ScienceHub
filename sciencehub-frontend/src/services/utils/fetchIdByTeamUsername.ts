import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";

export async function fetchIdByTeamUsername(
    supabase: SupabaseClient<Database>,
    teamUsername: string
): Promise<string | null> {
    const { data, error } = await supabase
        .from("teams")
        .select("id")
        .eq("team_username", teamUsername)
        .single();

    if (error) {
        console.error("Error fetching team ID:", error);
        return null;
    }

    return data?.id || null;
}
