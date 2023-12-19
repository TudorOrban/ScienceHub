import { MetadataDiffs, TextDiff } from "@/types/versionControlTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/supabase-js";

// Define the input type for the updateWorkDeltaField function
export type UpdateWorkDeltaFieldInput = {
    supabase: SupabaseClient<Database>;
    submissionId: number;
    fieldPath: string[];
    newValue: TextDiff[] | MetadataDiffs | any; // You can be more specific with the types if needed
};

// Define the output type (if needed)
export type UpdateWorkDeltaFieldOutput = {
    success: boolean;
    message?: string;
};

// Update the function signature
export async function updateWorkDeltaField({
    supabase,
    submissionId,
    fieldPath,
    newValue,
}: UpdateWorkDeltaFieldInput): Promise<UpdateWorkDeltaFieldOutput> {
    console.log("Updating:", submissionId, fieldPath, newValue);

    try {
        const response = await supabase.rpc("update_work_delta_field", {
            submission_id: submissionId,
            field_path: fieldPath,
            new_value: newValue,
        });
        // Handle response
        return { success: true, message: "Update successful" };
    } catch (error) {
        console.error("Error updating work delta field: ", error);
        throw error;
    }
}
