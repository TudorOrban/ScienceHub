import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectIssue } from "@/src/types/managementTypes";
import { MediumSearchOptions } from "@/src/types/searchTypes";


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
            categories: ["users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "title", "project_id", "created_at", "status", "public", "link"], 
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