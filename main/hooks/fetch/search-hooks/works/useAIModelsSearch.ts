import { createUseUnifiedSearch } from "@/hooks/fetch/search-hooks/useUnifiedSearch";
import { AIModel } from "@/types/workTypes";
import { SmallSearchOptions } from "@/types/utilsTypes";

export const useAIModelsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
    includeRefetch,
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<AIModel>({
        fetchGeneralDataParams: {
            tableName: "ai_models",
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