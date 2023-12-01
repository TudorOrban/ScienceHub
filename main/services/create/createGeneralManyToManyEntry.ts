import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type GeneralManyToManyInput = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    firstEntityColumnName: string;
    firstEntityId: number | string;
    secondEntityColumnName: string;
    secondEntityId: number | string;
};

export type GeneralManyToManyResult = {
    data?: any;
    error?: any;
};

export const createGeneralManyToManyEntry = async ({
    supabase,
    tableName,
    firstEntityColumnName,
    firstEntityId,
    secondEntityColumnName,
    secondEntityId,
}: GeneralManyToManyInput): Promise<GeneralManyToManyResult> => {
    const insertData = {
        [firstEntityColumnName]: firstEntityId,
        [secondEntityColumnName]: secondEntityId,
    };

    const { data, error } = await supabase
        .from(tableName)
        .insert([insertData])
        .select("*");

    if (error) {
        console.error("Supabase insert error:", error);
        return { error };
    }

    if (data && (data as any).length > 0) {
        return { data: data[0] };
    } else {
        console.warn("Data is null or empty after insert operation");
        return {
            error: new Error("Data is null or empty after insert operation"),
        };
    }
};
