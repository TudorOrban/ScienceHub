import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const deleteExperiment = async (
    supabase: SupabaseClient<Database>,
    experimentId: number
): Promise<void> => {
    const { error } = await supabase
        .from("experiments")
        .delete()
        .eq("id", experimentId);

    if (error) {
        throw error;
    }
};
