import {
    UpdateWorkDeltaFieldInput,
    UpdateWorkDeltaFieldOutput,
    updateWorkDeltaField,
} from "@/services/update/updateWorkDeltaField";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export const useUpdateWorkDeltaField = () => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<
        UpdateWorkDeltaFieldOutput,
        Error,
        Omit<UpdateWorkDeltaFieldInput, "supabase">
    >({
        mutationFn: async (input) => {
            return await updateWorkDeltaField({ supabase, ...input });
        },
    });
};
