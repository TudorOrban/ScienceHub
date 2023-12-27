// import { trpc } from "@/app/_trpc/client";
// import {
//     FetchGeneralDataParameters,
//     FetchGeneralDataParams,
// } from "@/services/fetch/fetchGeneralDataAPI";
// import { FetchBehavior } from "@/types/utilsTypes";
// import { Database } from "@/types_db";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";

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
//     enabled?: boolean;
//     staleTime?: number;
// };

// export const useGeneralQueryAPI = <T>(options: GeneralQueryOptions) => {
//     const supabase = useSupabaseClient();
//     if (!supabase) {
//         throw new Error("Supabase client is not available");
//     }

//     const fetchGeneralDataInput: FetchGeneralDataParameters = {
//         // supabase: supabase,
//         tableName: options.tableName,
//         tableRowsIds: options.tableRowsIds || [],
//         categories: options.categories,
//         tableNameFilters: options.tableNameFilters,
//         tableNameFields: options.tableNameFields,
//         relationships: options.relationships,
//         options: {
//             inputQuery: options.inputQuery,
//             filters: options.filters,
//             sortOption: options.sortOption,
//             descending: options.descending,
//             page: options.page,
//             itemsPerPage: options.itemsPerPage,
//             fetchMode: options.fetchMode,
//             categoriesFetchMode: options.categoriesFetchMode,
//             categoriesFields: options.categoriesFields,
//         },
//     };

//     // Using tRPC's useQuery
//     console.log(fetchGeneralDataInput);
//     const query = trpc.fetchGeneralData.useQuery(fetchGeneralDataInput, {
//         staleTime: options.staleTime || 60 * 1000,
//         enabled: options.enabled,
//     });

//     function transformData(
//         data: any[],
//         categories: string[],
//         categoriesFetchMode?: Record<string, FetchBehavior>
//     ) {
//         const transformedData: any[] = data.map((item) => {
//             const transformedItem: any = {};

//             // Copy fields from original data
//             Object.keys(item).forEach((key) => {
//                 transformedItem[key] = item[key];
//             });

//             // Handle special categories
//             for (const category of categories) {
//                 const fetchBehavior = categoriesFetchMode
//                     ? categoriesFetchMode[category]
//                     : "all";

//                 if (fetchBehavior === "count") {
//                     transformedItem[`${category}_count`] = item[category]
//                         ? item[category][0]?.count ?? 0
//                         : 0;
//                 } else if (fetchBehavior === "all") {
//                     transformedItem[category] = item[category] || [];
//                 }
//             }

//             return transformedItem;
//         });

//         return transformedData;
//     }

//     // If needed, you can transform the data before returning
//     const transformedData = transformData(
//         query.data ?? [],
//         options.categories,
//         options.categoriesFetchMode
//     );

//     return {
//         ...query,
//         data: transformedData,
//     };
// };
"use client";

import { trpc } from "@/app/_trpc/client";
import {
    FetchResult,
    fetchGeneralData,
} from "@/services/fetch/fetchGeneralData";
import { FetchGeneralDataParams } from "@/services/fetch/fetchGeneralData";
import { Database } from "@/types_db";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";

// React Query hook wrapper of the fetchGeneralData service; used in almost all site hooks

// Input/Output
// - Options related to React Query
export interface ReactQueryOptions<T> {
    enabled?: boolean;
    staleTime?: number;
    includeRefetch?: boolean;
    initialData?: FetchResult<T>;
}

// Extend service params
export interface UseGeneralDataParams<T> {
    fetchGeneralDataParams: FetchGeneralDataParams;
    reactQueryOptions: ReactQueryOptions<T>;
}

// Structure of the result
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
export const useGeneralData = <T extends unknown>({
    fetchGeneralDataParams: fetchParams,
    reactQueryOptions: {
        enabled,
        staleTime = 60 * 1000,
        includeRefetch = false,
        initialData = { data: [] },
    },
}: UseGeneralDataParams<T>): HookResult<T> => {
    
    // Use query
    const query = trpc.fetchGeneralData.useQuery<T>(fetchParams, {
        staleTime,
        enabled,
        initialData,
    });


    // Refetch if necessary
    const refetch = includeRefetch ? query.refetch : undefined;


    // console.log("Use General Data result", transformedResult);
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