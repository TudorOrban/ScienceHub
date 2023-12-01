import { GeneralDeleteInput, deleteGeneralData } from "@/services/delete/deleteGeneralData";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export const useDeleteGeneralData = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<void, Error, GeneralDeleteInput>({
        mutationFn: async (input: GeneralDeleteInput) => {
            await deleteGeneralData(input);
        },
    });
};
