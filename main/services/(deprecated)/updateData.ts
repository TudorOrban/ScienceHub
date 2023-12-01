import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function updateData(
    supabase: SupabaseClient<Database>,
    table: string,
    filters: object,
    data: object
) {
    const { error } = await supabase.from(table).update(data).match(filters);
    if (error) {
        throw error;
    }
}
