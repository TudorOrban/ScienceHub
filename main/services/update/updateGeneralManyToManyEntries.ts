import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";

export type GeneralUpdateManyToManyInput = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    firstEntityColumnName: string;
    firstEntityId: number;
    secondEntityColumnName: string;
    secondEntityIds: number[];
};

export type GeneralUpdateManyToManyOutput = {
    data?: any;
    error?: PostgrestError | null;
    tableName?: string;
};

export const updateGeneralManyToManyEntries = async ({
    supabase,
    tableName,
    firstEntityColumnName,
    firstEntityId,
    secondEntityColumnName,
    secondEntityIds,
}: GeneralUpdateManyToManyInput): Promise<GeneralUpdateManyToManyOutput> => {
    const insertData = secondEntityIds.map((id) => ({
        [firstEntityColumnName]: firstEntityId,
        [secondEntityColumnName]: id,
    }));

    const { data, error } = await supabase.from(tableName).upsert(insertData);

    if (error) {
        console.error("Supabase Delete Error: ", error);
    }

    return {
        data: data,
        error: error,
        tableName: tableName,
    };
};
