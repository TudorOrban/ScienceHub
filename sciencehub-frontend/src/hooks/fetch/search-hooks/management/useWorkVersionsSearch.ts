import { createUseUnifiedSearch } from "../useUnifiedSearch";
import {
    ProjectVersion,
} from "@/src/types/versionControlTypes";
import { SmallSearchOptions } from "@/src/types/utilsTypes";

export const useWorkVersionsSearch = ({
    extraFilters,
    enabled,
    context,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<ProjectVersion>({
        fetchGeneralDataParams: {
            tableName: "work_versions",
            categories: ["users"],
            withCounts: true,
            options: {
                // searchByField: "work_type",
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