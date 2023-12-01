import { GeneralCreateInput, createGeneralData } from "@/services/create/createGeneralData";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export const useCreateGeneralData = <T>() => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<T, Error, GeneralCreateInput<T>>(
        {
            mutationFn: async (input: GeneralCreateInput<T>) => {
                return await createGeneralData(input);
            },
        }
    );
};
