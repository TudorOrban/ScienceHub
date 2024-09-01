import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectVersion } from "@/src/types/versionControlTypes";
import { SmallSearchOptions,  } from "@/src/types/utilsTypes";

export const useProjectVersionsSearch = ({
    extraFilters,
    enabled,
    context,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<ProjectVersion>({
        fetchGeneralDataParams: {
            tableName: "project_versions",
            categories: ["users"],
            withCounts: true,
            options: {
                // searchByField: "description",
                page: 1,
                itemsPerPage: 500,
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
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};