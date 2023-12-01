import { FetchDataOptions } from "@/types/utilsTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const fetchData = async (
    supabase: SupabaseClient<Database>,
    tableName: string,
    options?: FetchDataOptions
): Promise<any[]> => {
    let query = supabase.from(tableName).select(options?.selectFields || "*");

    if (options?.relatedFields) {
        query = supabase.from(tableName).select(options?.relatedFields || "*");
    }

    // Handle filters
    if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
            query = query.eq(key, value); 
        }
    }

    // Handle order by
    if (options?.order) {
        query = query.order(options.order.column, {
            ascending: options.order.ascending,
        });
    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    return data || [];
};

export default fetchData;
