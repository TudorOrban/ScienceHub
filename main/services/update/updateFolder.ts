import { Folder } from "@/types/workTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type UpdateFolderInput = {
    folderId: number;
    updates: Partial<Folder>;
};

export const updateFolder = async (
    supabase: SupabaseClient<Database>,
    input: UpdateFolderInput
): Promise<Folder> => {
    const { data, error } = await supabase
        .from("folders")
        .update(input.updates)
        .eq("id", input.folderId);

    if (error) {
        throw error;
    }

    return data![0];
};
