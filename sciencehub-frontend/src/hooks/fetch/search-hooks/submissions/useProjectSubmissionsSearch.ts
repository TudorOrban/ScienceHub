import { MediumSearchOptions } from "@/src/types/searchTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectSubmission } from "@/src/types/versionControlTypes";

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
                tableFields: [
                    "id",
                    "project_id",
                    "created_at",
                    "title",
                    "status",
                    "initial_project_version_id",
                    "final_project_version_id",
                    "public",
                    "link"
                ],
                page: page || 1,
                itemsPerPage: itemsPerPage || 100,
                categoriesFetchMode: {
                    users: "fields",
                    // teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    // teams: ["id", "teamname", "team_username"],
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
        context: context || "Reusable",
    });

    return useUnifiedSearch();
};
