import {
    GeneralManyToManyInput,
    GeneralCreateManyToManyOutput,
    createGeneralManyToManyEntry,
} from "@/services/create/createGeneralManyToManyEntry";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";

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
