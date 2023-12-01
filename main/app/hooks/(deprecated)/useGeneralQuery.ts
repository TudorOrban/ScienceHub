import { fetchGeneralData } from "@/services/fetch/fetchGeneralDataDeprecated";
import { FetchBehavior } from "@/types/utilsTypes";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

export type GeneralQueryOptions = {
    inputQuery?: string;
    tableName: string;
    tableRowsIds?: string[];
    categories: string[];
    tableNameFilters?: Record<string, any>;
    tableNameFields?: string[];
    relationships?: Record<string, string>;
    filters?: Record<string, any>;
    sortOption?: string;
    descending?: boolean;
    page?: number;
    itemsPerPage?: number;
    fetchMode?: "all" | "counts" | "fields";
    categoriesFetchMode?: Record<string, FetchBehavior>;
    categoriesFields?: Record<string, string[]>;
    withCounts?: boolean;
    enabled?: boolean;
    staleTime?: number;
};

export const useGeneralQuery = <T>(options: GeneralQueryOptions) => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }


    const query = useQuery<T[], Error>({
        queryKey: [
            options.inputQuery,
            options.tableName,
            options.tableRowsIds,
            options.tableNameFields,
            options.filters,
            options.sortOption,
            options.descending,
            options.page,
            options.itemsPerPage,
            options.fetchMode,
            JSON.stringify(options.categoriesFetchMode),
            options.categoriesFields,
            options.withCounts,
            options.enabled,
        ],
        queryFn: async () => {
            const data = await fetchGeneralData({
                supabase: supabase,
                tableName: options.tableName,
                tableRowsIds: options.tableRowsIds || [],
                categories: options.categories,
                tableNameFilters: options.tableNameFilters,
                tableNameFields: options.tableNameFields,
                relationships: options.relationships,
                options: {
                    inputQuery: options.inputQuery,
                    filters: options.filters,
                    sortOption: options.sortOption,
                    descending: options.descending,
                    page: options.page,
                    itemsPerPage: options.itemsPerPage,
                    fetchMode: options.fetchMode,
                    categoriesFetchMode: options.categoriesFetchMode,
                    categoriesFields: options.categoriesFields,
                },
                withCounts: options.withCounts,
            });

            const transformedData = transformData(
                data,
                options.categories,
                options.categoriesFetchMode
            );

            return transformedData;
        },
        staleTime: options.staleTime || 60 * 1000,
        enabled: options.enabled,
    });

    function transformData(
        data: any[],
        categories: string[],
        categoriesFetchMode?: Record<string, FetchBehavior>
    ) {
        const transformedData: any[] = data.map((item) => {
            const transformedItem: any = {};
            
            // Copy fields from original data
            Object.keys(item).forEach((key) => {
                transformedItem[key] = item[key];
            });
            
            // Handle special categories
            for (const category of categories) {
                const fetchBehavior = categoriesFetchMode
                    ? categoriesFetchMode[category]
                    : "all";
                
                if (fetchBehavior === "count") {
                    transformedItem[`${category}_count`] = item[category]
                        ? item[category][0]?.count ?? 0
                        : 0;
                } else if (fetchBehavior === "all") {
                    transformedItem[category] = item[category] || [];
                }
            }
            
            return transformedItem;
        });
        
        return transformedData;
    }
    
    return query;
};
