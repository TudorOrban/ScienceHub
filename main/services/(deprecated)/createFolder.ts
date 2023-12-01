import { Folder } from "@/types/workTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-react";

export type CreateFolderInput = {
    name: string;
    project_id: number;
};

export const createFolder = async (
    supabase: SupabaseClient<Database>,
    input: CreateFolderInput
): Promise<Folder> => {
    const { data, error } = await supabase.from("folders").insert([input]);

    if (error) {
        throw error;
    }

    return data![0];
};
