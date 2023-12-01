import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const fetchUserProjectIds = async (
    supabase: SupabaseClient<Database>,
    userId: string
): Promise<{ projectId: number, role: string }[]> => {
    const { data, error } = await supabase
        .from("project_users")
        .select("project_id, role")
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data ? data.map((item) => ({ projectId: item.project_id, role: item.role || ""})) : [];
};
