import { Folder } from "@/types/workTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cache } from "react";

type FetchFoldersOptions = {
    projectId: number;
};

export const fetchFolders = cache(async (
    supabase: SupabaseClient<Database>,
    options: FetchFoldersOptions
): Promise<Folder[]> => {
    const { projectId } = options;

    let query = supabase
        .from("folders")
        .select("*")
        .or('id.eq.2,name.eq.Algeria')
        // .or(`and(project_id.eq.2,name.eq.Afgan),and(project_id.eq.1,name.eq.Afg)`);
        // .or("project_id.eq.1");

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw error;
    }

    if (!Array.isArray(data) || data.some((item) => typeof item !== "object")) {
        throw new Error("Unexpected data format");
    }

    return data as unknown as Folder[];
});
