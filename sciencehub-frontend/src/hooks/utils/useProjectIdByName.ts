import { fetchProjectIdByName } from "@/src/services/utils/fetchProjectIdByName";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

interface UseProjectIdByNameOptions {
    projectName: string;
}

export const useProjectIdByName = (options: UseProjectIdByNameOptions) => {
    const supabase = useSupabaseClient();
    const projectIdQueryKey = { queryKey: ["projectId", options.projectName] };

    return useQuery<number, Error>({
        queryKey: ["projectId", options.projectName],
        queryFn: async () => {
            const projectId = await fetchProjectIdByName(
                supabase,
                options.projectName
            );
            if (projectId === null) {
                throw new Error("Project ID not found");
            }
            return projectId;
        },
        staleTime: 50 * 1000,
    });
};
