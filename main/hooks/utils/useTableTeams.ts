import { fetchTableTeams } from "@/services/utils/fetchTableTeams";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

type UseObjectTeamsOptions = {
    objectIds: string[];
    tableName: string;
};

export const useTableTeams = (options: UseObjectTeamsOptions) => {
    const supabase = useSupabaseClient();
    const { objectIds, tableName } = options;

    const queryKey = [`${tableName}Teams`, objectIds.join(",")];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => fetchTableTeams(supabase, { objectIds, tableName }),
        staleTime: 5 * 1000,
    });
};
