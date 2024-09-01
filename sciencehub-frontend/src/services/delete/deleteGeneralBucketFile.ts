import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";

export type DeleteBucketInput = {
    supabase: SupabaseClient<Database>;
    bucketName: string;
    filePaths: string[];
};

export type DeleteBucketOutput = {
    error?: StorageError | null;
    bucketName?: string;
};

/**
 * Service for deleting Supabase bucket file.
 * To be fully replaced soon by the backend.
 */
export const deleteGeneralBucketFile = async ({
    supabase,
    bucketName,
    filePaths,
}: DeleteBucketInput): Promise<DeleteBucketOutput> => {
    const { error } = await supabase.storage.from(bucketName).remove(filePaths);

    if (error) {
        console.error("Supabase Delete Bucket Error: ", error);
    }

    return {
        error: error,
        bucketName: bucketName,
    };
};
