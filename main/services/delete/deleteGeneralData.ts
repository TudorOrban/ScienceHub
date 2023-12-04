import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type GeneralDeleteInput = {
    supabase: SupabaseClient<Database>;
    tableName: string;
    id: string | number;
    idLabel?: string;
};

export const deleteGeneralData = async ({
    supabase,
    tableName,
    id,
    idLabel,
}: GeneralDeleteInput): Promise<void> => {
    const { error } = await supabase.from(tableName).delete().eq(idLabel || "id", id);

    if (error) {
        console.error("Supabase Delete Error: ", error);
        throw error;
    }
};
