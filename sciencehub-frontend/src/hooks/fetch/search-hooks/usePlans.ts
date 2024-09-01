import { MediumSearchOptions } from "@/src/types/searchTypes";
import { createUseUnifiedSearch } from "./useUnifiedSearch";
import { Plan } from "@/src/types/utilsTypes";

export const usePlansSearch = ({
    tableFilters,
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Plan>({
        fetchGeneralDataParams: {
            tableName: "plans",
            categories: ["users"],
            withCounts: true,
            options: {
                tableFilters: tableFilters,
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: includeRefetch,
        },
        extraFilters: extraFilters,
        negativeFilters: negativeFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};
