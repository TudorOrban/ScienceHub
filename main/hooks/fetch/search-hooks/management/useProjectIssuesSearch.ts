import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectIssue } from "@/types/managementTypes";
import { MediumSearchOptions } from "@/types/searchTypes";


export const useProjectIssuesSearch = ({
    tableFilters,
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<ProjectIssue>({
        fetchGeneralDataParams: {
            tableName: "project_issues",
            categories: ["users"],
            withCounts: true,
            options: {
                tableFields: ["id", "title", "project_id", "created_at", "status", "public"], 
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