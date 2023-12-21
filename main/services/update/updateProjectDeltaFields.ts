import { TextDiff } from "@/types/versionControlTypes";
import { Database, Json } from "@/types_db";
import { SupabaseClient } from "@supabase/supabase-js";

export type UpdateProjectDeltaFieldsInput = {
    supabase: SupabaseClient<Database>;
    submissionId: number;
    deltaChanges: Json;
};

export type UpdateProjectDeltaFieldsOutput = {
    success: boolean;
    message?: string;
};

// Update the function signature
export async function updateProjectDeltaFields({
    supabase,
    submissionId,
    deltaChanges,
}: UpdateProjectDeltaFieldsInput): Promise<UpdateProjectDeltaFieldsOutput> {
    try {
        const response = await supabase.rpc("update_project_delta_partial", {
            submission_id: submissionId,
            delta_changes: deltaChanges,
        });

        // Handle response
        return { success: true, message: "Update successful" };
    } catch (error) {
        console.error("Error updating project delta field: ", error);
        throw error;
    }
}
