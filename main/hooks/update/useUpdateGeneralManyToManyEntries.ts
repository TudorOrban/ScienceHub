import {
    GeneralUpdateManyToManyInput,
    GeneralUpdateManyToManyOutput,
    updateGeneralManyToManyEntries,
} from "@/services/update/updateGeneralManyToManyEntries";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

/**
 * General React Query mutation for updating many-to-many relationship entries
 * To be fully replaced soon by the backend
 */
export const useUpdateManyToManyEntries = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<
        GeneralUpdateManyToManyOutput,
        PostgrestError,
        Omit<GeneralUpdateManyToManyInput, "supabase">
    >({
        mutationFn: async (input) => {
            return await updateGeneralManyToManyEntries({ supabase, ...input });
        },
    });
};
