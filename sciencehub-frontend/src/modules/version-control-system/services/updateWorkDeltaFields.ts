import { Database, Json } from "@/types_db";
import { SupabaseClient } from "@supabase/supabase-js";

export type UpdateWorkDeltaFieldsInput = {
    supabase: SupabaseClient<Database>;
    submissionId: number;
    deltaChanges: Json;
};

export type UpdateWorkDeltaFieldsOutput = {
    success: boolean;
    message?: string;
};

/**
 * Service calling a stored procedure to update the project delta,
 * so that the existing delta data is guaranteed to be fresh.
 * To be fully replaced soon by the backend.
 */
export async function updateWorkDeltaFields({
    supabase,
    submissionId,
    deltaChanges,
}: UpdateWorkDeltaFieldsInput): Promise<UpdateWorkDeltaFieldsOutput> {
    try {
        const response = await supabase.rpc("update_work_delta_partial", {
            submission_id: submissionId,
            delta_changes: deltaChanges,
        });

        // Handle response
        return { success: true, message: "Update successful" };
    } catch (error) {
        console.error("Error updating work delta field: ", error);
        throw error;
    }
}
