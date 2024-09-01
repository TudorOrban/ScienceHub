import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { cache } from "react";

export const fetchProjectIdByName = cache( async (
    supabase: SupabaseClient<Database>,
    projectName: string
): Promise<number | null> => {
    const { data, error } = await supabase
        .from("projects")
        .select("id")
        .eq("name", projectName)
        .single();

    if (error) {
        console.error("Error fetching project ID:", error);
        return null;
    }

    return data?.id || null;
});
