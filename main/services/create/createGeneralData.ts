import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";

export type GeneralCreateInput<T> = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    input: T;
};

export type GeneralCreateOutput = {
    data?: { id: number | string };
    error?: PostgrestError | null;
    tableName?: string;
};

/**
 * Service for creating general data.
 * To be fully replaced soon by the backend.
 */
export const createGeneralData = async <T>({
    supabase,
    tableName,
    input,
}: GeneralCreateInput<T>): Promise<GeneralCreateOutput> => {
    const { data, error } = await supabase.from(tableName).insert([input]).select("id");

    if (error) {
        console.error(`Supabase Insert Error in table ${tableName}: `, error);
    }

    return { data: data?.[0], error: error, tableName: tableName };
};
