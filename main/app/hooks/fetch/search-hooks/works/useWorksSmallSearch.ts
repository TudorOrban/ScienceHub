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
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: tableRowsIds || [],
                tableFields: [
                    "id", "title"
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
