import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type CreateProjectExperimentRelationshipInput = {
    project_id: number;
    experiment_id: number;
};
export const createProjectExperimentRelationship = async (
    supabase: SupabaseClient<Database>,
    input: CreateProjectExperimentRelationshipInput
) => {
    const { data, error } = await supabase
        .from("project_experiments")
        .insert([input]);

    if (error) {
        console.error("Supabase insert error:", error);
        throw error;
    }

    if (data && (data as any).length > 0) {
        return data[0];
    } else {
        console.warn("Data is null or empty after insert operation");
        return null;
    }
};
