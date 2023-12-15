import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";

export type GeneralCreateInput<T> = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    input: T;
};

export type GeneralCreateOutput<T> = {
    data?: Partial<T>;
    error?: PostgrestError | null; 
    tableName?: string;
};

export const createGeneralData = async <T>({
    supabase,
    tableName,
    input,
}: GeneralCreateInput<T>): Promise<GeneralCreateOutput<T>> => {
    const { data, error } = await supabase
        .from(tableName)
        .insert([input])
        .select("id");

    if (error) {
        console.error(`Supabase Insert Error in table ${tableName}: `, error);
    }

    return { data: data?.[0] as Partial<T>, error: error, tableName: tableName };
};

