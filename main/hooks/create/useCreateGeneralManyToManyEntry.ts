import {
    GeneralManyToManyInput,
    GeneralCreateManyToManyOutput,
    createGeneralManyToManyEntry,
} from "@/services/create/createGeneralManyToManyEntry";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

/**
 * General React Query mutation for creating many-to-many relationship entries
 * To be fully replaced soon by the backend
 */
export const useCreateGeneralManyToManyEntry = () => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<
        GeneralCreateManyToManyOutput,
        PostgrestError,
        Omit<GeneralManyToManyInput, "supabase">
    >(async (input) => {
        return await createGeneralManyToManyEntry({
            supabase,
            ...input,
        });
    });
};
