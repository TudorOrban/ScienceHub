import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const deleteFolder = async (
    supabase: SupabaseClient<Database>,
    folderId: number
): Promise<void> => {
    const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", folderId);

    if (error) {
        throw error;
    }
};
