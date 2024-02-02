import {
    GeneralCreateInput,
    GeneralCreateOutput,
    createGeneralData,
} from "@/services/create/createGeneralData";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

/**
 * General React Query mutation for creating data
 * To be fully replaced soon by the backend
 */
export const useCreateGeneralData = <T>() => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<
        GeneralCreateOutput,
        PostgrestError,
        Omit<GeneralCreateInput<T>, "supabase">
    >({
        mutationFn: async (input) => {
            return createGeneralData({ supabase, ...input });
        },
    });
};
