import { MediumSearchOptions } from "@/types/searchTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectSubmission } from "@/types/versionControlTypes";

export const useProjectSubmissionsSearch = ({
    tableFilters,
    negativeFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: MediumSearchOptions) => {
    
    const useUnifiedSearch = createUseUnifiedSearch<ProjectSubmission>({
        fetchGeneralDataParams: {
            tableName: "project_submissions",
            categories: ["users"],
            withCounts: true,
            options: {
                tableFilters: tableFilters,
                tableFields: ["id", "project_id", "title", "description", "public", "initial_project_version_id", "final_project_version_id"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    projects: ["id"],
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