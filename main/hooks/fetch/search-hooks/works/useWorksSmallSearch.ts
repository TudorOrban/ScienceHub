import { WorkSmall } from "@/types/workTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { SmallSearchOptions } from "@/types/utilsTypes";

export interface WorksSmallSearchOptions extends SmallSearchOptions {
    tableName: string;
    tableRowsIds?: string[];
}

export const useWorksSmallSearch = ({
    tableName,
    tableRowsIds,
    extraFilters,
    enabled,
    context,
}: WorksSmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<WorkSmall>({
        fetchGeneralDataParams: {
            tableName: tableName,
            categories: ["users", "projects"],
            withCounts: true,
            options: {
                tableRowsIds: tableRowsIds || undefined,
                tableFields: [
                    "id", "title", "link"
                ],
                page: 1,
                itemsPerPage: 50,
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
        },
        extraFilters: extraFilters,
        context: context || "Reusable",
    });

    return useUnifiedSearch();
};
