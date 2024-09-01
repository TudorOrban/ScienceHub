import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectReview } from "@/src/types/managementTypes";
import { MediumSearchOptions } from "@/src/types/searchTypes";


export const useProjectReviewsSearch = ({
    tableFilters,
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<ProjectReview>({
        fetchGeneralDataParams: {
            tableName: "project_reviews",
            categories: ["users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "project_id", "review_type", "status", "public", "link", "title", "description"],
                tableFilters: tableFilters,
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                },
                categoriesFields: {
                    users: ["id", "full_name", "username"],
                    teams: ["id", "team_name", "team_username"]
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