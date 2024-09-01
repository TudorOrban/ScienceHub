import {
    UpdateWorkDeltaFieldsInput,
    UpdateWorkDeltaFieldsOutput,
    updateWorkDeltaFields,
} from "@/src/modules/version-control-system/services/updateWorkDeltaFields";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

/**
 * React query mutation hook to update the fields of of a project delta
 */
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
