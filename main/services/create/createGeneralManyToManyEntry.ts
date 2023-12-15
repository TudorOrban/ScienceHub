import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";

export type GeneralManyToManyInput = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    firstEntityColumnName: string;
    firstEntityId: number | string;
    secondEntityColumnName: string;
    secondEntityId: number | string;
};

export type GeneralCreateManyToManyOutput = {
    data?: any;
    error?: PostgrestError | null;
    tableName?: string;
};

export const createGeneralManyToManyEntry = async ({
    supabase,
    tableName,
    firstEntityColumnName,
    firstEntityId,
    secondEntityColumnName,
    secondEntityId,
}: GeneralManyToManyInput): Promise<GeneralCreateManyToManyOutput> => {
    const insertData = {
        [firstEntityColumnName]: firstEntityId,
        [secondEntityColumnName]: secondEntityId,
    };

    const { data, error } = await supabase.from(tableName).insert([insertData]).select("*");

    if (error) {
        console.error(`Supabase insert error in table ${tableName}: `, error);
    }

    return {
        data: data,
        error: error,
        tableName: tableName,
    };
};
