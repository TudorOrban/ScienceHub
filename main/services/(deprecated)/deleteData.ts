import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function deleteData(
    supabase: SupabaseClient<Database>,
    table: string,
    filters: object
) {
    const { error } = await supabase.from(table).delete().match(filters);
    if (error) {
        throw error;
    }
}
