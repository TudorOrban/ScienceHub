import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";
import { User } from "@/types/userTypes";

type FetchUserDetailsProps = {
    userId: string;
    selectFields?: string;
};

export const fetchUserDetails = async (
    supabase: SupabaseClient<Database>,
    options: FetchUserDetailsProps
): Promise<User> => {
    const { userId, selectFields } = options;

    let query = supabase
        .from("users")
        .select(selectFields || "*")
        .eq("id", userId);

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw error;
    }

    if (
        !Array.isArray(data) ||
        data.length !== 1 ||
        typeof data[0] !== "object"
    ) {
        throw new Error("Unexpected data format");
    }

    return data[0] as User;
};
