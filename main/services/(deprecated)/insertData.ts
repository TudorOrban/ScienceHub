import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function insertData(
    supabase: SupabaseClient<Database>,
    table: string,
    data: object
) {
    const { error } = await supabase.from(table).insert(data);
    if (error) {
        throw error;
    }
}
