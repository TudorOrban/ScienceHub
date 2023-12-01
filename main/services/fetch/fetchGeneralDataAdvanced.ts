import { ComparisonFilter, FetchBehavior } from "@/types/utilsTypes";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";
import { getObjectNames } from "@/utils/getObjectNames";

// Dynamic types for database snake_case names

type ToSnakeCase<S extends string> =
    S extends `${infer P1}${infer P2}${infer P3}`
        ? P2 extends Capitalize<P2>
            ? `${P1}_${Uncapitalize<P2>}${ToSnakeCase<
                  P2 extends Capitalize<P2> ? `${P3}` : `${P2}${P3}`
              >}`
            : `${P1}${P2}${ToSnakeCase<P3>}`
        : S;

export type SnakeCaseObject<T> = {
    [K in keyof T as ToSnakeCase<string & K>]: T[K] extends object
        ? SnakeCaseObject<T[K]>
        : T[K];
};

// Input/Output
export type SearchOptions = {
    searchByField?: string;
    searchByCategory?: string; // secondary table to search by
    searchByCategoryField?: string; // secondary table's field
    tableRowsIds?: string[]; // rows of the main table to fetch
    tableFields?: string[]; // main table fields to fetch
    tableFilters?: Record<string, any>; // filters on main table
    inputQuery?: string; // search query
    caseSensitive?: boolean;
    filters?: Record<string, any>; // filters on secondary table
    negativeFilters?: Record<string, any>;
    comparisonFilter?: Record<string, ComparisonFilter[]>;
    sortOption?: string;
    descending?: boolean;
    page?: number; // for pagination
    itemsPerPage?: number;
    categoriesFetchMode?: Record<string, FetchBehavior>; // fetch mode of secondary table (all, counts, fields)
    categoriesFields?: Record<string, string[]>; // secondary table's fields to fetch
    relationshipNames?: Record<string, string>;
};

export type FetchGeneralDataParams = {
    // database
    tableName: string; // main table that is fetched, eg projects
    categories?: string[]; // tables in many-to-many with tableName, eg users experiments datasets..
    withCounts?: boolean; // new optional parameter
    options: SearchOptions;
};

export interface FetchResult<T> {
    data: SnakeCaseObject<T>[]; // accounting for snake_case schema
    totalCount?: number; // total count for pagination
    isLoading?: boolean;
    serviceError?: any; // error from fetchGeneralData
}

export async function fetchGeneralDataAdvanced<T>(
    supabase: SupabaseClient<Database>, // supabase client with database type
    {
        tableName = "",
        categories = [],
        withCounts = false,
        options = {
            searchByField: "",
            searchByCategory: "",
            searchByCategoryField: "",
            tableRowsIds: [],
            tableFields: [],
            tableFilters: {},
            inputQuery: "",
            caseSensitive: false,
            filters: {},
            negativeFilters: {},
            comparisonFilter: {},
            sortOption: "updated_at",
            descending: true,
            page: 1,
            itemsPerPage: 10,
            categoriesFetchMode: {},
            categoriesFields: {},
            relationshipNames: {},
        },
    }: FetchGeneralDataParams
): Promise<FetchResult<T>> {
    // Select: main table fields, secondary table fields, with fetch mode prescribed
    const selectString = constructSelectString(
        tableName,
        options.tableFields || [],
        categories || [],
        options.filters || {},
        options.categoriesFetchMode || {},
        options.categoriesFields || {},
        options.relationshipNames || {}
    );

    console.log("Select string", tableName, selectString);
    let query = supabase.from(tableName).select(selectString as "*");

    //  Hande main table filters
    if (options.tableRowsIds && options.tableRowsIds.length > 0) {
        query = query.in("id", options.tableRowsIds);
    }

    if (options.tableFilters) {
        for (const [key, value] of Object.entries(options.tableFilters)) {
            query = Array.isArray(value)
                ? query.in(key, value)
                : query.eq(key, value);
        }
    }

    // Handle input query
    const searchBy = options.searchByCategory && options.searchByCategoryField;
    const searchByField = options.searchByField || "title";
    const queryKey = searchBy
        ? `${options.searchByCategory}.${options.searchByCategoryField}`
        : searchByField;

    if (options.inputQuery) {
        if (options.caseSensitive) {
            query = query.like(queryKey, `%${options.inputQuery}%`);
        } else {
            query = query.ilike(queryKey, `%${options.inputQuery}%`);
        }
    }

    // Handle filters (with inner join feature)
    if (options.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
            const isCategory = categories?.includes(key.split(".")[0]);
            const queryKey = isCategory ? `${key}.id` : key;

            if (Array.isArray(value)) {
                query = query.in(queryKey, value);
            } else {
                query = query.eq(queryKey, value);
            }
        }
    }

    if (options.negativeFilters) {
        for (const [key, value] of Object.entries(options.negativeFilters)) {
            const isCategory = categories?.includes(key.split(".")[0]);
            const queryKey = isCategory ? `${key}.id` : key;

            if (Array.isArray(value)) {
                query = query.not(queryKey, "in", value);
            } else {
                query = query.neq(queryKey, value);
            }
        }
    }

    if (options.comparisonFilter) {
        for (const [key, filterArray] of Object.entries(
            options.comparisonFilter
        )) {
            for (const filter of filterArray) {
                // Iterate through each filter in the array
                const isCategory = categories?.includes(key.split(".")[0]);
                const queryKey = isCategory ? `${key}.id` : key;

                if (filter.greaterThan) {
                    query = query.gte(queryKey, filter.value);
                } else {
                    query = query.lte(queryKey, filter.value);
                }
            }
        }
    }

    // Handle sorting
    if (options.sortOption) {
        const realColumnName = options.sortOption || "updated_at";
        query = query.order(realColumnName, { ascending: !options.descending });
    }

    // Handle pagination
    if (options.page && options.itemsPerPage) {
        const startIndex = (options.page - 1) * options.itemsPerPage;
        query = query.range(startIndex, startIndex + options.itemsPerPage - 1);
    }

    // Query
    const { data, error } = await query;

    // Fetch total count for pagination
    let finalCount = -1;

    if (withCounts) {
        const countResponse = await supabase
            .from(tableName)
            .select("id", { head: true, count: "exact" });
        const totalCount = parseInt(countResponse.count?.toString() || "0");
        finalCount = totalCount;
    }

    // Prepare the result
    const fetchedResult: FetchResult<T> = {
        data: data || [],
        totalCount: finalCount,
        serviceError: error,
    };

    return fetchedResult;
}

const constructSelectString = (
    tableName: string,
    tableFields: string[],
    categories: string[],
    filters: Record<string, any>,
    categoriesFetchMode: Record<string, FetchBehavior>,
    categoriesFields?: Record<string, string[]>,
    relationshipNames: Record<string, string> = {},
) => {
    let selectString = "";

    // Main table fields
    if (!tableFields || tableFields.length === 0) {
        selectString = "*";
    } else {
        tableFields.forEach((field, index) => {
            selectString += index === 0 ? `${field}` : `,${field}`;
        });
    }

    // Associated tables with prescribed fields to fetch and mode (all or counts)
    categories.forEach((cat) => {
        const behavior = categoriesFetchMode?.[cat] || "all";
        // Supabase inner join feature for handling many-to-many filtering
        const innerJoin = filters && filters[cat] ? "!inner" : "";

        const relationshipName = relationshipNames[cat];
        let relationshipSuffix = relationshipName ? `!${relationshipName}` : "";
          
        if (cat === "users") {
            const intermediateName = getObjectNames({ tableName: tableName })?.tableNameForIntermediate;
            relationshipSuffix = "!" + intermediateName + "_users";
        } 
        if (cat === "projects") {
            relationshipSuffix = "!project_" + tableName;
        } 

        switch (behavior) {
            case "all":
                selectString += `,${cat}${relationshipSuffix}${innerJoin}(*)`;
                break;
            case "fields":
                const fieldsList = categoriesFields
                    ? categoriesFields[cat].join(",")
                    : "*";
                selectString += `,${cat}${relationshipSuffix}${innerJoin}(${fieldsList})`;
                break;
            case "count":
                selectString += `,${cat}${relationshipSuffix}(count)`;
                break;
            case "none":
                break;
        }
    });

    return selectString;
};

// export type GeneralFetchOptions = {
//     searchByCategory?: string;
//     searchByField?: string;
//     inputQuery?: string;
//     filters?: Record<string, any>;
//     tableNameFilters?: Record<string, any>;
//     sortOption?: string;
//     descending?: boolean;
//     page?: number;
//     itemsPerPage?: number;
//     fetchMode?: string;
//     categoriesFetchMode?: Record<string, FetchBehavior>;
//     categoriesFields?: Record<string, string[]>;
// };

// export type FetchGeneralDataParams = {
//     supabase: SupabaseClient<Database>; // database
//     tableName: string; // main table that is fetched, eg projects
//     tableRowsIds: string[]; // a subset of rows of tableName
//     categories: string[]; // tables in many-to-many with tableName, eg users experiments datasets..
//     tableNameFilters?: Record<string, any>; // filters on the main table
//     tableNameFields?: string[]; // new parameter
//     options: GeneralFetchOptions;
//     withCounts?: boolean; // new optional parameter
// };

// export interface FetchResult<T> {
//     data: SnakeCaseObject<T>[];
//     totalCount?: number;
//     isLoading?: boolean;
//     serviceError?: any;
//     hookError?: any;
// }

// export async function fetchGeneralData<T>({
//     supabase, //ignore
//     tableName = "projects", // main table that is fetched, eg projects
//     tableRowsIds, // a subset of rows of tableName
//     categories, // tables in many-to-many with tableName, eg users experiments datasets..
//     tableNameFilters, // filters on the main table
//     tableNameFields, // new parameter
//     options = {
//         // search options
//         searchByCategory: "",
//         searchByField: "",
//         inputQuery: "",
//         filters: {}, // filters
//         sortOption: "date",
//         descending: true,
//         page: 1,
//         itemsPerPage: 10,
//         fetchMode: "counts",
//         categoriesFetchMode: {}, //  "all", "counts" or "fields"
//         categoriesFields: {}, // if "fields", select only categoriesFields information from corresponding category
//     },
//     withCounts = false,
// }: FetchGeneralDataParams): Promise<FetchResult<T>> {
//     // console.log("TABLENAME FIELDS", tableNameFields)
//     let selectString =
//         options.fetchMode === "fields" && tableNameFields
//             ? tableNameFields.join(",")
//             : "*";

//     categories.forEach((cat) => {
//         const behavior = options.categoriesFetchMode?.[cat] || "all";
//         const innerJoin =
//             options.filters && options.filters[cat] ? "!inner" : "";

//         switch (behavior) {
//             case "all":
//                 selectString += `,${cat}${innerJoin}(*)`;
//                 break;
//             case "fields":
//                 const fieldsList = options.categoriesFields
//                     ? options.categoriesFields[cat].join(",")
//                     : "*";
//                 selectString += `,${cat}${innerJoin}(${fieldsList})`;
//                 break;
//             case "count":
//                 selectString += `,${cat}(count)`;
//                 break;
//             case "none":
//                 break;
//         }
//     });

//     // console.log("Select string", selectString);
//     let query = supabase.from(tableName).select(selectString as "*");

//     if (tableRowsIds && tableRowsIds.length > 0) {
//         query = query.in("id", tableRowsIds);
//     }

//     if (options.searchByCategory && options.searchByField) {
//         const queryKey = `${options.searchByCategory}.${options.searchByField}`;
//         query = query.ilike(queryKey, `%${options.inputQuery}%`);
//     }

//     // Handle search query
//     else if (options.inputQuery) {
//         query = query.ilike("title", `%${options.inputQuery}%`);
//     }

//     // Handle search query
//     if (options.inputQuery) {
//         query = query.ilike("title", `%${options.inputQuery}%`);
//     }

//     // Handle tableName filters
//     if (options.tableNameFilters) {
//         for (const [key, value] of Object.entries(options.tableNameFilters)) {
//             query = Array.isArray(value)
//                 ? query.in(key, value)
//                 : query.eq(key, value);
//         }
//     }

//     // Handle filters (with inner join feature)
//     if (options.filters) {
//         for (const [key, value] of Object.entries(options.filters)) {
//             const isCategory = categories.includes(key.split(".")[0]);
//             const queryKey = isCategory ? `${key}.id` : key;

//             if (Array.isArray(value)) {
//                 query = query.in(queryKey, value);
//             } else {
//                 query = query.eq(queryKey, value);
//             }
//         }
//     }

//     // // Handle sorting
//     if (options.sortOption) {
//         const realColumnName =
//             sortOptionMapping[options.sortOption] || options.sortOption;
//         query = query.order(realColumnName, { ascending: !options.descending });
//     }

//     // Handle pagination
//     if (options.page && options.itemsPerPage) {
//         const startIndex = (options.page - 1) * options.itemsPerPage;
//         query = query.range(startIndex, startIndex + options.itemsPerPage - 1);
//     }

//     console.log("Select string", selectString);
//     // console.log("FILTERS:", tableName, options.filters);

//     // Query
//     const { data, error } = await query;

//     // Fetch total count for pagination
//     let finalCount = -1;

//     if (withCounts) {
//         const countResponse = await supabase
//             .from(tableName)
//             .select("id", { head: true, count: "exact" });
//         const totalCount = parseInt(countResponse.count?.toString() || "0");
//     }

//     // Result
//     const fetchedResult: FetchResult<T> = {
//         data: data || [],
//         totalCount: finalCount,
//         serviceError: error,
//     };

//     return fetchedResult;
// }
