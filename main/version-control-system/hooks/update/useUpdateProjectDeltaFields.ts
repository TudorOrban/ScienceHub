import {
    UpdateProjectDeltaFieldsInput,
    UpdateProjectDeltaFieldsOutput,
    updateProjectDeltaFields,
} from "@/version-control-system/services/updateProjectDeltaFields";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

/**
 * React query mutation hook to update the fields of of a project delta
 */
export const useUpdateProjectDeltaFields = () => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<
        UpdateProjectDeltaFieldsOutput,
        Error,
        Omit<UpdateProjectDeltaFieldsInput, "supabase">
    >({
        mutationFn: async (input) => {
            return await updateProjectDeltaFields({ supabase, ...input });
        },
    });
};
