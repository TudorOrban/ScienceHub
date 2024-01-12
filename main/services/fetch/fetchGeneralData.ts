import { ComparisonFilter, FetchBehavior } from "@/types/utilsTypes";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";
import { getObjectNames } from "@/config/getObjectNames";
import { cache } from "react";
import { SnakeCaseObject } from "./fetchGeneralDataAdvanced";

// Basis of the entire fetching system;
// Used in:
// a) server fetches of project/work/submission/... data, OR
// b) useGeneralData, a React Query wrapper hook

// Note: has an advanced version for browse pages

// Input/Output
export type MediumSearchOptions = {
    searchByField?: string;
    searchByCategory?: string; // secondary table to search by
    searchByCategoryField?: string; // secondary table's field
    tableRowsIds?: (string | number)[]; // rows of the main table to fetch
    tableFields?: string[]; // main table fields to fetch
    tableFilters?: Record<string, any>; // filters on main table
    tableFilterRow?: string; // used rarely
    inputQuery?: string; // search query
    filters?: Record<string, any>; // filters on secondary table
    negativeFilters?: Record<string, any>;
    sortOption?: string;
    descending?: boolean;
    page?: number; // for pagination
    itemsPerPage?: number;
    categoriesFetchMode?: Record<string, FetchBehavior>; // fetch mode of secondary table (all, counts, fields)
    categoriesFields?: Record<string, string[]>; // secondary table's fields to fetch
    categoriesLimits?: Record<string, number>; // limits on secondary table
    relationshipNames?: Record<string, string>;
};

export type FetchGeneralDataParams = {
    tableName: string; // main table that is fetched, eg projects
    categories?: string[]; // tables in one-to-many/many-to-many with tableName, eg users experiments datasets..
    withCounts?: boolean; // new optional parameter
    options: MediumSearchOptions;
};

export interface FetchResult<T> {
    data: T[];
    totalCount?: number; // total count for pagination
    isLoading?: boolean;
    serviceError?: any; // error from fetchGeneralData
}

export const revalidate = 3600;

export const fetchGeneralData = cache(
    async <T>(
        supabase: SupabaseClient<Database>, // supabase client with database type
        {
            tableName = "",
            categories = [],
            withCounts = false,
            options = {
                searchByField: "",
                searchByCategory: "",
                searchByCategoryField: "",
                tableFields: [],
                tableFilters: {},
                inputQuery: "",
                filters: {},
                negativeFilters: {},
                sortOption: "updated_at",
                descending: true,
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {},
                categoriesFields: {},
                categoriesLimits: {},
                relationshipNames: {},
            },
        }: FetchGeneralDataParams
    ): Promise<FetchResult<T>> => {
        // If tableRowsIds is empty return early
        if (
            options.tableRowsIds !== null &&
            options.tableRowsIds !== undefined &&
            options.tableRowsIds.length === 0
        ) {
            return {
                data: [],
                totalCount: -2,
                serviceError: "No table rows ids",
            };
        }

        // Select: main table fields, secondary table fields, with fetch mode prescribed
        const selectString = constructSelectString(
            tableName,
            options.tableFields || [],
            categories || [],
            options.filters || {},
            options.negativeFilters || {},
            options.categoriesFetchMode || {},
            options.categoriesFields || {},
            options.relationshipNames || {}
        );

        // console.log("Select string", tableName, selectString);
        let query = supabase.from(tableName).select(selectString, { count: "exact" });

        //  Hande main table filters
        if (options.tableRowsIds && options.tableRowsIds.length > 0) {
            query = query.in(options.tableFilterRow || "id", options.tableRowsIds);
        }

        if (options.tableFilters) {
            for (const [key, value] of Object.entries(options.tableFilters)) {
                query = Array.isArray(value) ? query.in(key, value) : query.eq(key, value);
            }
        }

        // Handle input query
        const searchBy = options.searchByCategory && options.searchByCategoryField;
        const searchByField = options.searchByField || "title";
        const queryKey = searchBy
            ? `${options.searchByCategory}.${options.searchByCategoryField}`
            : searchByField;

        if (options.inputQuery) {
            query = query.ilike(queryKey, `%${options.inputQuery}%`);
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

        // Handle negative filters
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

        // Handle limits on secondary tables
        if (options.categoriesLimits) {
            for (const [key, value] of Object.entries(options.categoriesLimits)) {
                query = query.limit(value, { referencedTable: key });
            }
        }

        // Query
        // Strong type query result
        const { data, error, count } = await query.returns<SnakeCaseObject<T>[]>();

        // Transform from database snake_case to camelCase
        const transformedData: T[] | undefined = data?.map((rawData: SnakeCaseObject<T>) => {
            return snakeCaseToCamelCase<T>(rawData);
        });

        // Prepare the result
        const fetchedResult: FetchResult<T> = {
            data: transformedData || [],
            totalCount: count || -1,
            serviceError: error,
        };

        return fetchedResult;
    }
);

const constructSelectString = (
    tableName: string,
    tableFields: string[],
    categories: string[],
    filters: Record<string, any>,
    negativeFilters: Record<string, any>,
    categoriesFetchMode: Record<string, FetchBehavior>,
    categoriesFields?: Record<string, string[]>,
    relationshipNames: Record<string, string> = {}
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
        const innerJoin =
            (filters && filters[cat]) || (negativeFilters && negativeFilters[cat]) ? "!inner" : "";

        // Handle many-to-many relationships with users, teams and projects
        const relationshipName = relationshipNames[cat];
        let relationshipSuffix = relationshipName ? `!${relationshipName}` : "";

        if (cat === "users") {
            const intermediateName = getObjectNames({
                tableName: tableName,
            })?.tableNameForIntermediate;
            relationshipSuffix = "!" + intermediateName + "_users";
        }
        if (cat === "teams") {
            const intermediateName = getObjectNames({
                tableName: tableName,
            })?.tableNameForIntermediate;
            relationshipSuffix = "!" + intermediateName + "_teams";
        }
        if (cat === "projects") {
            relationshipSuffix = "!project_" + tableName;
        }

        // Options: fetch all rows, fetch specified rows (fields), fetch counts, fetch none
        switch (behavior) {
            case "all":
                selectString += `,${cat}${relationshipSuffix}${innerJoin}(*)`;
                break;
            case "fields":
                const fieldsList = categoriesFields ? categoriesFields[cat].join(",") : "*";
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

export const camelCase = (str: string) => {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
    );
};

export const snakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Key transformation from snake_case
export function keysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(keysToCamelCase);
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (acc, key) => ({
                ...acc,
                [camelCase(key)]: keysToCamelCase(obj[key]),
            }),
            {}
        );
    }
    return obj;
}

export function snakeCaseToCamelCase<T>(obj: SnakeCaseObject<T>): T {
    if (Array.isArray(obj)) {
        return obj.map(keysToCamelCase) as T;
    } else if (obj !== null && obj?.constructor === Object) {
        return Object.keys(obj).reduce(
            (acc, key) => ({
                ...acc,
                [camelCase(key)]: keysToCamelCase((obj as any)[key]),
            }),
            {} as T
        );
    }
    return obj as T;
}
