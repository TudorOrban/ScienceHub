import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";

export type GeneralDeleteInput = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    id: string | number;
    idLabel?: string;
};

export type GeneralDeleteOutput = {
    deletedId?: string | number;
    error?: PostgrestError | null;
    tableName?: string;
};

/**
 * Service for deleting general data.
 * To be fully replaced soon by the backend.
 */
export const deleteGeneralData = async ({
    supabase,
    tableName,
    id,
    idLabel,
}: GeneralDeleteInput): Promise<GeneralDeleteOutput> => {
    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(idLabel || "id", id);

    if (error) {
        console.error(`Supabase Delete Error in table ${tableName}: `, error);
    }

    return {
        deletedId: id,
        error: error,
        tableName,
    };
};
