import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectDelta } from "@/types/versionControlTypes";

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
            tableName: "project_deltas",
            categories: [],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
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
