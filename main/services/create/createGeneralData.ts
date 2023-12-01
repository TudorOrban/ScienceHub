import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type GeneralCreateInput<T> = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    input: T;
    returnFields?: string;
};

export const createGeneralData = async <T>({
    supabase,
    tableName,
    input,
    returnFields,
}: GeneralCreateInput<T>): Promise<T> => {
    const { data, error } = await supabase
        .from(tableName)
        .insert([input])
        .select(returnFields || "*");

    if (error) {
        console.error("Supabase Insert Error: ", error);
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error("No data returned from insert operation");
    }

    return data[0] as any;
};
