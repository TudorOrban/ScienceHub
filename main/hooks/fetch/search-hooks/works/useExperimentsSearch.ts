import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { Experiment } from "@/types/workTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";

export const useExperimentsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Experiment>({
        fetchGeneralDataParams: {
            tableName: "experiments",
            categories: ["projects", "users"],
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
            includeRefetch: includeRefetch,
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    });

    return useUnifiedSearch();
};