import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { WorkIssue } from "@/types/managementTypes";
import { MediumSearchOptions } from "@/types/searchTypes";


export const useWorkIssuesSearch = ({
    tableFilters,
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<WorkIssue>({
        fetchGeneralDataParams: {
            tableName: "work_issues",
            categories: ["users", "teams"],
            withCounts: true,
            options: {
                tableFields: ["id", "title", "work_id", "work_type", "created_at", "status", "public"], 
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