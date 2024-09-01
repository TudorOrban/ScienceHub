import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectDelta } from "@/src/types/versionControlTypes";

export const useProjectDeltaSearch = (
    initialProjectVersionId: string[],
    finalProjectVersionId: string[],
    enabled?: boolean,
    context?: string,
    page?: number,
    itemsPerPage?: number,
) => {
    const useUnifiedSearch = createUseUnifiedSearch<ProjectDelta>({
        fetchGeneralDataParams: {
            tableName: "project_submissions",
            categories: [],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                tableFields: ["id", "initial_project_version_id", "final_project_version_id", "project_delta"],
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                    projects: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            staleTime: 0,
        },
        extraFilters: {
            initial_project_version_id: initialProjectVersionId,
            final_project_version_id: finalProjectVersionId,
        },
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};
