import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";

export type GeneralUpdateInput<T> = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    identifierField: string;
    identifier: number | string;
    updateFields: Partial<T>;
};

export type GeneralUpdateOutput = {
    updatedId?: string | number;
    error?: PostgrestError | null;
    tableName?: string;
};

/**
 * Service for updating general data.
 * To be fully replaced soon by the backend.
 */
export const updateGeneralData = async <T>({
    supabase,
    tableName,
    identifierField,
    identifier,
    updateFields,
}: GeneralUpdateInput<T>): Promise<GeneralUpdateOutput> => {
    const { data, error } = await supabase
        .from(tableName)
        .update(updateFields)
        .eq(identifierField, identifier)
        .select("id");

    if (error) {
        console.error("Supabase Update Error: ", error);
    }

    return {
        updatedId: data?.[0]?.id,
        error: error,
        tableName: tableName,
    };
};
