import { FetchBehavior } from "@/types/utilsTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { MaybePromise } from "@trpc/server";

const sortOptionMapping: { [key: string]: string } = {
    date: "created_at",
    name: "title",
};

export type GeneralFetchOptions = {
    inputQuery?: string;
    filters?: Record<string, any>;
    tableNameFilters?: Record<string, any>;
    sortOption?: string;
    descending?: boolean;
    page?: number;
    itemsPerPage?: number;
    fetchMode?: string;
    categoriesFetchMode?: Record<string, FetchBehavior>;
    categoriesFields?: Record<string, string[]>;
};

export type FetchGeneralDataParams = {
    supabase: SupabaseClient<Database>, //ignore
    tableName: string, // main table that is fetched, eg projects
    tableRowsIds: string[], // a subset of rows of tableName
    categories: string[], // tables in many-to-many with tableName, eg users experiments datasets..
    tableNameFilters?: Record<string, any>, // filters on the main table
    tableNameFields?: string[], // new parameter
    relationships?: Record<string, string>, // no role currently, ignore
    options: GeneralFetchOptions,
}

export const fetchGeneralData = async ({
    supabase, //ignore
    tableName = "projects", // main table that is fetched, eg projects
    tableRowsIds, // a subset of rows of tableName
    categories, // tables in many-to-many with tableName, eg users experiments datasets..
    tableNameFilters, // filters on the main table
    tableNameFields,
    options = { // search options
        inputQuery: "",
        filters: {}, // filters
        sortOption: "date",
        descending: true,
        page: 1,
        itemsPerPage: 10,
        fetchMode: "counts",
        categoriesFetchMode: {}, //  "all", "counts" or "fields"
        categoriesFields: {}, // if "fields", select only categoriesFields information from corresponding category
    }
}: FetchGeneralDataParams): Promise<any[]> => {

    console.log("Filters before query", tableName, options.filters);
    // console.log("TABLENAME FIELDS", tableNameFields)
    let selectString = options.fetchMode === "fields" && tableNameFields 
        ? tableNameFields.join(",") 
        : "*";

    categories.forEach((cat) => {
        const behavior = options.categoriesFetchMode?.[cat] || "all";
        const innerJoin = options.filters && options.filters[cat] ? "!inner" : "";
    
        switch (behavior) {
            case "all":
                selectString += `,${cat}${innerJoin}(*)`;
                break;
            case "fields":
                const fieldsList = options.categoriesFields
                    ? options.categoriesFields[cat].join(",")
                    : "*";
                selectString += `,${cat}${innerJoin}(${fieldsList})`;
                break;
            case "count":
                selectString += `,${cat}(count)`;
                break;
            case "none":
                break;
        }
    });
    

    // console.log("Select string", selectString);
    let query = supabase.from(tableName).select(selectString);
    if (tableRowsIds && tableRowsIds.length > 0) {
        query = query.in("id", tableRowsIds);
    }

    // Handle search query
    if (options.inputQuery) {
        query = query.ilike("title", `%${options.inputQuery}%`);
    }

    // Handle tableName filters
    if (options.tableNameFilters) {
        for (const [key, value] of Object.entries(options.tableNameFilters)) {
            query = Array.isArray(value)
                ? query.in(key, value)
                : query.eq(key, value);
        }
    }

    // console.log("FILTERS:", options.filters);

    // Handle filters (with inner join feature)
    if (options.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
            const isCategory = categories.includes(key.split(".")[0]);
            const queryKey = isCategory ? `${key}.id` : key;
        
            if (Array.isArray(value)) {
                query = query.in(queryKey, value);
            } else {
                query = query.eq(queryKey, value);
            }
        }
        
    }

    // // Handle sorting
    if (options.sortOption) {
        const realColumnName =
            sortOptionMapping[options.sortOption] || options.sortOption;
        query = query.order(realColumnName, { ascending: !options.descending });
    }

    // Handle pagination
    if (options.page && options.itemsPerPage) {
        const startIndex = (options.page - 1) * options.itemsPerPage;
        query = query.range(startIndex, startIndex + options.itemsPerPage - 1);
    }
    

    const { data, error } = await query;

    if (error) {
        console.log("Fetch error", error);
        throw error;
    }
    // console.log("FETCHGENERAL", data);

    return data || [];
};

export type FetchGeneralDataParameters = {
    tableName: string, // main table that is fetched, eg projects
    tableRowsIds: string[], // a subset of rows of tableName
    categories: string[], // tables in many-to-many with tableName, eg users experiments datasets..
    tableNameFilters?: Record<string, any>, // filters on the main table
    tableNameFields?: string[], // new parameter
    relationships?: Record<string, string>, // no role currently, ignore
    options: GeneralFetchOptions,
}