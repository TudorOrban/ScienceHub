import { MediumSearchOptions } from "@/types/searchTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { Review } from "@/types/managementTypes";

export const useReviewsSearch = ({
    tableFilters,
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Review>({
        fetchGeneralDataParams: {
            tableName: "reviews",
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