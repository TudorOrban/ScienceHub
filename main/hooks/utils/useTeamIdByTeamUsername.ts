import { fetchIdByTeamUsername } from "@/services/utils/fetchIdByTeamUsername";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

interface UseIdByTeamUsernameOptions {
    teamUsername: string;
}

export const useIdByTeamUsername = (options: UseIdByTeamUsernameOptions) => {
    const supabase = useSupabaseClient();

    return useQuery<string, Error>({
        queryKey: ["teamId", options.teamUsername],
        queryFn: async () => {
            const teamId = await fetchIdByTeamUsername(supabase, options.teamUsername);
            if (teamId === null) {
                throw new Error("Tean ID not found");
            }
            return teamId;
        },
        staleTime: 50 * 1000,
    });
};
