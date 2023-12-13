import { Database } from "@/types_db"
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js"

export type DeleteBucketInput = {
    supabase: SupabaseClient<Database>;
    bucketName: string;
    filePaths: string[];
}

export const deleteGeneralBucketFile = async ({
    supabase,
    bucketName,
    filePaths,
}: DeleteBucketInput): Promise<PostgrestError | null> => {

    const { error } = await supabase
        .storage
        .from(bucketName)
        .remove(filePaths);

    if (error) {
        console.error("Supabase Delete Bucket Error: ", error);
        throw error;
    }

    return error;
}