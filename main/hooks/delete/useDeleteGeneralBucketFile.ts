import {
    DeleteBucketInput,
    DeleteBucketOutput,
    deleteGeneralBucketFile,
} from "@/services/delete/deleteGeneralBucketFile";
import { StorageError } from "@supabase/storage-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { Database } from "@/types_db";

/**
 * General React Query mutation for deleting Supabase bucket file
 * To be fully replaced soon by the backend
 */
export const useDeleteGeneralBucketFile = () => {
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<DeleteBucketOutput, StorageError, Omit<DeleteBucketInput, "supabase">>({
        mutationFn: async (input) => {
            return deleteGeneralBucketFile({ supabase, ...input });
        },
    });
};
