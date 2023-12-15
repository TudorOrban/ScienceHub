import {
    GeneralUpdateManyToManyInput,
    GeneralUpdateManyToManyOutput,
    updateGeneralManyToManyEntries,
} from "@/services/update/updateGeneralManyToManyEntries";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

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
