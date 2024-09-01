import {
    GeneralUpdateInput,
    GeneralUpdateOutput,
    updateGeneralData,
} from "@/src/services/update/updateGeneralData";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

/**
 * General React Query mutation for updating data
 * To be fully replaced soon by the backend
 */
export const useUpdateGeneralData = <T>() => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<T>, "supabase">
    >({
        mutationFn: async (input) => {
            return await updateGeneralData<T>({ supabase, ...input });
        },
    });
};
