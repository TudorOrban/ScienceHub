import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type GeneralUpdateManyToManyEntriesInput = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    firstEntityColumnName: string;
    firstEntityId: number;
    secondEntityColumnName: string;
    secondEntityIds: number[];
};

export const updateGeneralManyToManyEntries = async ({
    supabase,
    tableName,
    firstEntityColumnName,
    firstEntityId,
    secondEntityColumnName,
    secondEntityIds,
}: GeneralUpdateManyToManyEntriesInput) => {
    // First, delete the existing relationships
    const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq(firstEntityColumnName, firstEntityId);
        
    if (deleteError) {
        console.error("Supabase Delete Error: ", deleteError);
        throw deleteError;
    }

    // Then, insert the new relationships
    const insertData = secondEntityIds.map(id => ({
        [firstEntityColumnName]: firstEntityId,
        [secondEntityColumnName]: id
    }));
    
    const { data, error: insertError } = await supabase
        .from(tableName)
        .upsert(insertData);

    if (insertError) {
        console.error("Supabase Insert Error: ", insertError);
        throw insertError;
    }

    return data;
};
