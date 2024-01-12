import {
    FetchGeneralDataParams,
    fetchGeneralDataAdvanced,
} from "@/services/fetch/fetchGeneralDataAdvanced";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { HookResult, ReactQueryOptions } from "./useGeneralData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";

// Input/Output

export interface UseGeneralDataParams<T> {
    fetchGeneralDataParams: FetchGeneralDataParams;
    reactQueryOptions: ReactQueryOptions<T>;
}

export const useGeneralDataAdvanced = <T>({
    fetchGeneralDataParams: fetchParams,
    reactQueryOptions: { enabled, staleTime = 60 * 1000 },
}: UseGeneralDataParams<T>): HookResult<T> => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }
    const queryClient = useQueryClient();

    const queryKey: QueryKey = [
        fetchParams.tableName,
        fetchParams.categories,
        fetchParams.withCounts,
        fetchParams.options.searchByField,
        fetchParams.options.caseSensitive,
        fetchParams.options.inputQuery,
        fetchParams.options.tableRowsIds,
        fetchParams.options.tableFields,
        fetchParams.options.filters,
        fetchParams.options.sortOption,
        fetchParams.options.descending,
        fetchParams.options.page,
        fetchParams.options.itemsPerPage,
        fetchParams.options.comparisonFilter,
        JSON.stringify(fetchParams.options.categoriesFetchMode),
        fetchParams.options.categoriesFields,
        enabled,
    ];
    
    // Use query
    const query = useQuery<FetchResult<T>, Error>({
        queryKey: queryKey,
        queryFn: async (): Promise<FetchResult<T>> => {
            const fetchResult = await fetchGeneralDataAdvanced<T>(
                supabase,
                fetchParams
            );

            return fetchResult;
        },
        staleTime: staleTime || 60 * 1000,
        enabled: enabled,
    });

    // Refetch if necessary
    const refetch = () => {
        console.log("Refetching");
        queryClient.invalidateQueries(queryKey);
    };

    // console.log("Use General Data result", transformedResult);
    return {
        data: query.data?.data || [],
        totalCount: query.data?.totalCount,
        isLoading: query?.isLoading,
        serviceError: query.data?.serviceError,
        hookError: query.error,
        status: query.status,
        refetch: refetch,
    };
};