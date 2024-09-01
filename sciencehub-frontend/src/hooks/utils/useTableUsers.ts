import { fetchTableUsers } from "@/src/services/utils/fetchTableUsers";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

type UseObjectUsersOptions = {
    objectIds: string[];
    tableName: string;
    roles?: string[];
    enabled?: boolean;
};

export const useTableUsers = (options: UseObjectUsersOptions) => {
    const supabase = useSupabaseClient();
    const { objectIds, tableName, roles } = options;

    const queryKey = [`${tableName}Users`, objectIds.join(",")];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => fetchTableUsers(supabase, { objectIds, tableName, roles }),
        staleTime: 5 * 1000,
        enabled: options.enabled,
    });
};
