import { fetchIdByUsername } from "@/src/services/utils/fetchIdByUsername";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

interface UseUserIdOptions {
    username: string;
    enabled?: boolean;
}

export const useIdByUsername = (options: UseUserIdOptions) => {
    const supabase = useSupabaseClient();
    const userIdQueryKey = { queryKey: ["userId", options.username] };

    return useQuery<string, Error>({
        queryKey: ["userId", options.username],
        queryFn: async () => {
            const userId = await fetchIdByUsername(supabase, options.username);
            if (userId === null) {
                throw new Error("User ID not found");
            }
            return userId;
        },
        staleTime: 50 * 1000,
        enabled: options.enabled,
    });
};
