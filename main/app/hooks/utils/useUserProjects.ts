// useUserProjects.ts
"use client";

import { fetchUserProjectIds } from "@/services/fetch/fetchUserProjects";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface UserProject {
  projectId: number;
  role: string;
}

export const useUserProjects = (userId: string | null): UseQueryResult<UserProject[], Error> => {
    const supabase = useSupabaseClient();
    let query = useQuery<UserProject[], Error>({
        queryKey: ["userProjects", userId],
        queryFn: async () => {
            if (!userId) {
                return [];
            }
            return await fetchUserProjectIds(supabase, userId);
        },
        enabled: !!userId,
        staleTime: 5 * 1000,
    });

    return query;
};
