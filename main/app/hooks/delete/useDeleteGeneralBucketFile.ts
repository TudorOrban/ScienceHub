import {
    DeleteBucketInput,
    deleteGeneralBucketFile,
} from "@/services/delete/deleteGeneralBucketFile";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export const useDeleteGeneralBucketFile = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<void, Error, DeleteBucketInput>({
        mutationFn: async (input: DeleteBucketInput) => {
            await deleteGeneralBucketFile(input);
        },
    });
};
