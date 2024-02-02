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
    extraInfo?: any;
};

export type GeneralCreateManyToManyOutput = {
    data?: any;
    error?: PostgrestError | null;
    tableName?: string;
};

/**
 * Service for creating many-to-many relationship entries.
 * To be fully replaced soon by the backend.
 */
export const createGeneralManyToManyEntry = async ({
    supabase,
    tableName,
    firstEntityColumnName,
    firstEntityId,
    secondEntityColumnName,
    secondEntityId,
    extraInfo,
}: GeneralManyToManyInput): Promise<GeneralCreateManyToManyOutput> => {
    let insertData = {
        [firstEntityColumnName]: firstEntityId,
        [secondEntityColumnName]: secondEntityId,
    };

    if (extraInfo) {
        insertData = {
            ...insertData,
            ...extraInfo,
        };
    }

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
