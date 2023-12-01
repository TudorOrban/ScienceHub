import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type GeneralUpdateInput<T> = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    identifierField: string;
    identifier: number | string;
    updateFields: Partial<T>;
};

export const updateGeneralData = async <T>({
    supabase,
    tableName,
    identifierField,
    identifier,
    updateFields,
}: GeneralUpdateInput<T>): Promise<T> => {
    const { data, error } = await supabase
        .from(tableName)
        .update(updateFields) 
        .eq(identifierField, identifier)
        .select("*");
        
    if (error) {
        console.error("Supabase Update Error: ", error);
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error("No data returned from update operation");
    }

    return data[0] as T;
};
