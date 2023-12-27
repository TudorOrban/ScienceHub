import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { WorkReview } from "@/types/managementTypes";
import { MediumSearchOptions } from "@/types/searchTypes";

export const useWorkReviewsSearch = ({
    tableFilters,
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<WorkReview>({
        fetchGeneralDataParams: {
            tableName: "work_reviews",
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