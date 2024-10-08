import { ComparisonFilter, FetchBehavior } from "@/src/types/utilsTypes";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";
import { getObjectNames } from "@/src/config/getObjectNames";
import { FetchResult, snakeCaseToCamelCase } from "./fetchGeneralData";

/**
 * Advanced version of fetchGeneralDataAdvanced.
 * Used through useGeneralDataAdvanced in Browse pages.
 */

// Dynamic types to handle snake_case - camelCase notation discrepancy between database-app types
export type ToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
    ? T extends Capitalize<T>
        ? `${T extends "_" ? "" : "_"}${Lowercase<T>}${ToSnakeCase<U>}`
        : `${T}${ToSnakeCase<U>}`
    : S;

export type SnakeCaseObject<T> = T extends any[]
    ? T extends Array<infer U>
        ? Array<SnakeCaseObject<U>>
        : never
    : T extends object
    ? { [K in keyof T as ToSnakeCase<K & string>]: SnakeCaseObject<T[K]> }
    : T;

// Input/Output
export type SearchOptions = {
    searchByField?: string;
    searchByCategory?: string; // secondary table to search by
    searchByCategoryField?: string; // secondary table's field
    tableRowsIds?: (string | number)[]; // rows of the main table to fetch
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
        options.categoriesFetchMode || {},
        options.categoriesFields || {},
        options.relationshipNames || {}
    );

    console.log("DSA", selectString);
    // console.log("Select string", tableName, selectString);
    let query = supabase.from(tableName).select(selectString, { count: "exact" });

    //  Hande main table filters
    if (options.tableRowsIds && options.tableRowsIds.length > 0) {
        query = query.in("id", options.tableRowsIds);
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
        for (const [key, filterArray] of Object.entries(options.comparisonFilter)) {
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

const constructSelectString = (
    tableName: string,
    tableFields: string[],
    categories: string[],
    filters: Record<string, any>,
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
        const innerJoin = filters && filters[cat] ? "!inner" : "";

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
