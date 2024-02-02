import {
    GeneralDeleteInput,
    GeneralDeleteOutput,
    deleteGeneralData,
} from "@/services/delete/deleteGeneralData";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

/**
 * General React Query mutation for deleting data
 * To be fully replaced soon by the backend
 */
export const useDeleteGeneralData = () => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<GeneralDeleteOutput, Error, Omit<GeneralDeleteInput, "supabase">>({
        mutationFn: async (input) => {
            return deleteGeneralData({ supabase, ...input });
        },
    });
};
