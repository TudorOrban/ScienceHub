"use client";

import {
    FetchResult,
    fetchGeneralData,
} from "@/services/fetch/fetchGeneralData";
import { FetchGeneralDataParams } from "@/services/fetch/fetchGeneralData";
import { snakeCaseToCamelCase } from "@/utils/functions";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";

// React Query hook wrapper of the fetchGeneralData service; used in almost all site hooks

// Input/Output
// - Options related to React Query
export interface ReactQueryOptions {
    enabled?: boolean;
    staleTime?: number;
    includeRefetch?: boolean;
}

// Extend service params
export interface UseGeneralDataParams {
    fetchGeneralDataParams: FetchGeneralDataParams;
    reactQueryOptions: ReactQueryOptions;
}

// Structure of the result
export interface HookResult<T> {
    data: T[];
    totalCount?: number;
    isLoading?: boolean;
    serviceError?: any;
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
    },
}: UseGeneralDataParams): HookResult<T> => {
    // Get clients
    const supabase = useSupabaseClient();
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
            const fetchResult = await fetchGeneralData<T>(
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
        queryClient.invalidateQueries(queryKey);
    };

    // Transform database snake_case names to camelCase names
    // const transformedResult = transformToCamelCase<T>(
    //     query?.data?.data || [],
    //     {
    //         isLoading: query.isLoading,
    //         hookError: query.error,
    //         totalCount: query.data?.totalCount,
    //         serviceError: query.data?.serviceError ?? null,
    //         refetch: includeRefetch ? refetch : undefined,
    //     },
    //     enabled
    // );

    // console.log("Use General Data result", transformedResult);
    return {
        data: query.data?.data || [],
        totalCount: query.data?.totalCount,
        isLoading: query.data?.isLoading,
        serviceError: query.data?.serviceError,
        hookError: query.error,
        refetch: includeRefetch ? refetch : undefined,
    };
};

// function transformToCamelCase<T>(
//     rawDataArray: SnakeCaseObject<T>[],
//     extraInfo: any,
//     enabled?: boolean
// ): HookResult<T> {
//     // Don't transform if hook is not running
//     if (!rawDataArray && !Array.isArray(rawDataArray)) {
//         return {
//             data: [],
//             isLoading: extraInfo.isLoading,
//             serviceError: extraInfo.error,
//             totalCount: extraInfo.totalCount,
//         };
//     }
//     if (!enabled) {
//         return {
//             data: [],
//             isLoading: extraInfo.isLoading,
//             serviceError: extraInfo.error,
//             totalCount: extraInfo.totalCount,
//         };
//     }

//     // Use snake_case -> camelCase conversion
//     const transformedData: T[] = rawDataArray.map((rawData) => {
//         return snakeCaseToCamelCase<T>(rawData) as T;
//     });

//     return {
//         data: transformedData,
//         totalCount: extraInfo.totalCount,
//         isLoading: extraInfo.isLoading,
//         serviceError: extraInfo.serviceError,
//         hookError: extraInfo.hookError,
//         refetch: extraInfo.refetch,
//     };
// }
