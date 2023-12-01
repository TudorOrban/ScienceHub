import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

interface BaseTableProperties {
    id: number;
}

export const fetchProjectData = async <T extends BaseTableProperties>(
    supabase: SupabaseClient<Database>,
    options: { projectId: number; table: string }
): Promise<T[]> => {
    const { projectId, table } = options;
    const selectParam = `id, ${table}(*)`;

    let query = supabase.from("projects").select(selectParam);

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw error;
    }

    if (!Array.isArray(data) || data.some((item) => typeof item !== "object")) {
        throw new Error("Unexpected data format");
    }

    return data as unknown as T[];
};
