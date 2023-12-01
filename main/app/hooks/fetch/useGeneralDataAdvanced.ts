import {
    FetchGeneralDataParams,
    FetchResult,
    SnakeCaseObject,
    fetchGeneralDataAdvanced,
} from "@/services/fetch/fetchGeneralDataAdvanced";
import { snakeCaseToCamelCase } from "@/utils/functions";
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

    // console.log("IIIIIIIIIIIII", transformedResult);
    return transformedResult;
};

// function transformData(
//     data: any,
//     categories: string[],
//     categoriesFetchMode?: Record<string, FetchBehavior>
// ) {
//     const transformedData: any = data.map((item) => {
//         const transformedItem: any = {};

//         // Copy fields from original data
//         Object.keys(item).forEach((key) => {
//             transformedItem[key] = item[key];
//         });

//         // Handle special categories
//         for (const category of categories) {
//             const fetchBehavior = categoriesFetchMode
//                 ? categoriesFetchMode[category]
//                 : "all";

//             if (fetchBehavior === "count") {
//                 transformedItem[`${category}_count`] = item[category]
//                     ? item[category][0]?.count ?? 0
//                     : 0;
//             } else if (fetchBehavior === "all") {
//                 transformedItem[category] = item[category] || [];
//             }
//         }

//         return transformedItem;
//     });

//     return transformedData;
// }

// export type GeneralQueryOptions = {
//     inputQuery?: string;
//     tableName: string;
//     tableRowsIds?: string[];
//     categories: string[];
//     tableNameFilters?: Record<string, any>;
//     tableNameFields?: string[];
//     relationships?: Record<string, string>;
//     filters?: Record<string, any>;
//     sortOption?: string;
//     descending?: boolean;
//     page?: number;
//     itemsPerPage?: number;
//     fetchMode?: "all" | "counts" | "fields";
//     categoriesFetchMode?: Record<string, FetchBehavior>;
//     categoriesFields?: Record<string, string[]>;
//     withCounts?: boolean;
//     enabled?: boolean;
//     staleTime?: number;
// };

// export const useGeneralQuery = <T>(
//     options: GeneralQueryOptions
// ): HookResult<T> => {
//     const supabase = useSupabaseClient();
//     if (!supabase) {
//         throw new Error("Supabase client is not available");
//     }

//     const query = useQuery<FetchResult<T>, Error>({
//         queryKey: [
//             options.inputQuery,
//             options.tableName,
//             options.tableRowsIds,
//             options.tableNameFields,
//             options.filters,
//             options.sortOption,
//             options.descending,
//             options.page,
//             options.itemsPerPage,
//             options.fetchMode,
//             JSON.stringify(options.categoriesFetchMode),
//             options.categoriesFields,
//             options.withCounts,
//             options.enabled,
//         ] as QueryKey,
//         queryFn: async (): Promise<FetchResult<T>> => {
//             const fetchResult = await fetchGeneralData<T>({
//                 supabase: supabase,
//                 tableName: options.tableName,
//                 tableRowsIds: options.tableRowsIds || [],
//                 categories: options.categories,
//                 tableNameFilters: options.tableNameFilters,
//                 tableNameFields: options.tableNameFields,
//                 relationships: options.relationships,
//                 options: {
//                     inputQuery: options.inputQuery,
//                     filters: options.filters,
//                     sortOption: options.sortOption,
//                     descending: options.descending,
//                     page: options.page,
//                     itemsPerPage: options.itemsPerPage,
//                     fetchMode: options.fetchMode,
//                     categoriesFetchMode: options.categoriesFetchMode,
//                     categoriesFields: options.categoriesFields,
//                 },
//                 withCounts: options.withCounts,
//             });

//             console.log("SSAKASJ", fetchResult);
//             // if (fetchResult.data !== null) {
//             //     transformedData = transformData(
//             //         fetchResult.data,
//             //         options.categories,
//             //         options.categoriesFetchMode
//             //     );
//             // }

//             return fetchResult;
//         },
//         staleTime: options.staleTime || 60 * 1000,
//         enabled: options.enabled,
//     });

//     const transformedResult = transformToCamelCase<T>(query?.data?.data || [], {
//         isLoading: query.isLoading,
//         hookError: query.error,
//         totalCount: query.data?.totalCount,
//         serviceError: query.data?.serviceError ?? null,
//     });

//     // const result: FetchResult<T> = {
//     //     data: query?.data?.data || [],
//     //     isLoading: query.isLoading,
//     //     hookError: query.error,
//     //     totalCount: query.data?.totalCount,
//     //     serviceError: query.data?.serviceError ?? null,
//     // };

//     console.log("IIIIIIIIIIIII", transformedResult);
//     return transformedResult;
//     // function transformData(
//     //     data: any,
//     //     categories: string[],
//     //     categoriesFetchMode?: Record<string, FetchBehavior>
//     // ) {
//     //     const transformedData: any = data.map((item) => {
//     //         const transformedItem: any = {};

//     //         // Copy fields from original data
//     //         Object.keys(item).forEach((key) => {
//     //             transformedItem[key] = item[key];
//     //         });

//     //         // Handle special categories
//     //         for (const category of categories) {
//     //             const fetchBehavior = categoriesFetchMode
//     //                 ? categoriesFetchMode[category]
//     //                 : "all";

//     //             if (fetchBehavior === "count") {
//     //                 transformedItem[`${category}_count`] = item[category]
//     //                     ? item[category][0]?.count ?? 0
//     //                     : 0;
//     //             } else if (fetchBehavior === "all") {
//     //                 transformedItem[category] = item[category] || [];
//     //             }
//     //         }

//     //         return transformedItem;
//     //     });

//     //     return transformedData;
//     // }
// };

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
