"use client";

import { FetchResult, fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";
import { FetchGeneralDataParams } from "@/src/services/fetch/fetchGeneralData";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * React Query hook wrapper of the fetchGeneralData service;
 * Used in almost all of the website's hooks, either by itself or through useUnifiedSearch
 */

// Input/Output
// - React Query options
export interface ReactQueryOptions<T> {
    enabled?: boolean;
    staleTime?: number;
    includeRefetch?: boolean;
    initialData?: FetchResult<T>;
}

// - Input
export interface UseGeneralDataParams<T> {
    fetchGeneralDataParams: FetchGeneralDataParams;
    reactQueryOptions: ReactQueryOptions<T>;
}

// - Output
export interface HookResult<T> {
    data: T[];
    totalCount?: number;
    isLoading?: boolean;
    serviceError?: any;
    status?: string;
    hookError?: any;
    refetch?: () => void;
}

// Hook
export const useGeneralData = <T>({
    fetchGeneralDataParams: fetchParams,
    reactQueryOptions: {
        enabled,
        staleTime = 60 * 1000,
        includeRefetch = false,
        initialData = undefined,
    },
}: UseGeneralDataParams<T>): HookResult<T> => {
    // Get clients
    const supabase = useSupabaseClient<Database>();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }
    const queryClient = useQueryClient();

    // Construct key
    const queryKey: QueryKey = [
        fetchParams.tableName,
        fetchParams.categories,
        fetchParams.withCounts,
        fetchParams.options.searchByField,
        fetchParams.options.inputQuery,
        fetchParams.options.tableRowsIds,
        fetchParams.options.tableFields,
        fetchParams.options.tableFilterRow,
        fetchParams.options.filters,
        fetchParams.options.negativeFilters,
        fetchParams.options.sortOption,
        fetchParams.options.descending,
        fetchParams.options.page,
        fetchParams.options.itemsPerPage,
        JSON.stringify(fetchParams.options.categoriesFetchMode),
        fetchParams.options.categoriesFields,
        enabled,
    ] as QueryKey;

    // Use query
    const query = useQuery<FetchResult<T>, Error>({
        queryKey: queryKey,
        queryFn: async (): Promise<FetchResult<T>> => {
            const fetchResult = await fetchGeneralData<T>(supabase, fetchParams);

            return fetchResult;
        },
        staleTime: staleTime || 60 * 1000,
        enabled: enabled,
        initialData: initialData,
    });

    // Attach refetch
    const refetch = () => {
        console.log("Refetching");
        queryClient.invalidateQueries(queryKey);
    };

    return {
        data: query.data?.data || [],
        totalCount: query.data?.totalCount,
        isLoading: query?.isLoading,
        serviceError: query.data?.serviceError,
        hookError: query.error,
        status: query.status,
        refetch: includeRefetch ? refetch : undefined,
    };
};
