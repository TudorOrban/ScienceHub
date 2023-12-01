import { GeneralUpdateManyToManyEntriesInput, updateGeneralManyToManyEntries } from "@/services/update/updateGeneralManyToManyEntries";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export const useUpdateManyToManyEntries = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<any, Error, GeneralUpdateManyToManyEntriesInput>(
        {
            mutationFn: async (input: GeneralUpdateManyToManyEntriesInput) => {
                return await updateGeneralManyToManyEntries(input);
            },
        }
    );
};
