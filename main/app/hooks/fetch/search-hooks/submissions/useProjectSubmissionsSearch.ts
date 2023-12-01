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
                // tableFields: ["id", "title", "description", "public"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    projects: "fields",
                },
                categoriesFields: {
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
