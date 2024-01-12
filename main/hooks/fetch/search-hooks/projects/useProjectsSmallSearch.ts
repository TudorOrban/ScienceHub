import { SmallSearchOptions, UseWorksSearchOptions } from "@/types/utilsTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { ProjectSmall } from "@/types/projectTypes";

export interface ProjectsSmallSearchOptions extends SmallSearchOptions {
    tableRowsIds?: string[];
}

export const useProjectsSmallSearch = ({
    tableRowsIds,
    extraFilters,
    enabled,
    context,
}: ProjectsSmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<ProjectSmall>({
        fetchGeneralDataParams: {
            tableName: "projects",
            categories: ["users"],
            withCounts: true,
            options: {
                tableFields: [
                    "id", "title", "name", "link"
                ],
                page: 1,
                itemsPerPage: 50,
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