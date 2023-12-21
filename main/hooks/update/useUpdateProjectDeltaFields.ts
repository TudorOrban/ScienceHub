import {
    UpdateProjectDeltaFieldsInput,
    UpdateProjectDeltaFieldsOutput,
    updateProjectDeltaFields,
} from "@/services/update/updateProjectDeltaFields";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

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
