import { snakeCaseToCamelCase } from "@/services/fetch/fetchGeneralData";
import {
    FetchGeneralDataParams,
    FetchResult,
    SnakeCaseObject,
    fetchGeneralDataAdvanced,
} from "@/services/fetch/fetchGeneralDataAdvanced";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { QueryKey, useQuery } from "@tanstack/react-query";

// Input/Output
export interface ReactQueryOptions {
    enabled?: boolean;
    staleTime?: number;
}

export interface UseGeneralDataParams {
    fetchGeneralDataParams: FetchGeneralDataParams;
    reactQueryOptions: ReactQueryOptions;
}

export interface HookResult<T> {
    data: T[];
    totalCount?: number;
    isLoading?: boolean;
    serviceError?: any;
    hookError?: any;
}

export const useGeneralDataAdvanced = <T>({
    fetchGeneralDataParams: fetchParams,
    reactQueryOptions: { enabled, staleTime = 60 * 1000 },
}: UseGeneralDataParams): HookResult<T> => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    const query = useQuery<FetchResult<T>, Error>({
        queryKey: [
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
        ] as QueryKey,
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

    const transformedResult = transformToCamelCase<T>(
        query?.data?.data || [],
        {
            isLoading: query.isLoading,
            hookError: query.error,
            totalCount: query.data?.totalCount,
            serviceError: query.data?.serviceError ?? null,
        },
        enabled,
    );

    return transformedResult;
};

function transformToCamelCase<T>(
    rawDataArray: SnakeCaseObject<T>[],
    extraInfo: any,
    enabled?: boolean
): HookResult<T> {
    if (!rawDataArray && !Array.isArray(rawDataArray)) {
        return {
            data: [],
            isLoading: extraInfo.isLoading,
            serviceError: extraInfo.error,
            totalCount: extraInfo.totalCount,
        };
    }
    if (!enabled) {
        return {
            data: [],
            isLoading: extraInfo.isLoading,
            serviceError: extraInfo.error,
            totalCount: extraInfo.totalCount,
        };
    }

    const transformedData: T[] = rawDataArray.map((rawData) => {
        return snakeCaseToCamelCase<T>(rawData) as T;
    });

    return {
        data: transformedData,
        totalCount: extraInfo.totalCount,
        isLoading: extraInfo.isLoading,
        serviceError: extraInfo.serviceError,
        hookError: extraInfo.hookError,
    };
}
