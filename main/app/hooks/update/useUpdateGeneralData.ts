import { GeneralUpdateInput, updateGeneralData } from "@/services/update/updateGeneralData";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export const useUpdateGeneralData = <T>() => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<T, Error, GeneralUpdateInput<T>>(
        {
            mutationFn: async (input: GeneralUpdateInput<T>) => {
                return await updateGeneralData<T>(input);
            },
        }
    );
};
