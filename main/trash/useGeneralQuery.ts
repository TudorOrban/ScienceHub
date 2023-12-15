
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
//     
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
