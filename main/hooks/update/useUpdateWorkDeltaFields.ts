import {
    UpdateWorkDeltaFieldsInput,
    UpdateWorkDeltaFieldsOutput,
    updateWorkDeltaFields,
} from "@/services/update/updateWorkDeltaFields";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export const useUpdateWorkDeltaFields = () => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<
        UpdateWorkDeltaFieldsOutput,
        Error,
        Omit<UpdateWorkDeltaFieldsInput, "supabase">
    >({
        mutationFn: async (input) => {
            return await updateWorkDeltaFields({ supabase, ...input });
        },
    });
};
